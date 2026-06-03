import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { 
  AlertCircle, CheckCircle2, FileText, ScanLine, XCircle
} from 'lucide-react';
import { operativoService } from '../services/operativo.service';
import { socketService } from '../services/socket.service';

interface MovementFormProps {
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export interface MovementFormHandle {
  activateManualMode: () => void;
}

interface FeedbackState {
  type: 'success' | 'error' | 'loading' | null;
  message: string;
}

interface OperativoResponse {
  ok: boolean;
  mensaje: string;
  bahia?: string;
  movimiento?: unknown;
}

type TurnoIngresoRow = {
  placa: string;
  horaIngreso: string;
  tipoVehiculo: string;
};

type VehiculoSeleccionable = {
  placa: string;
  tipoVehiculo: string;
  color: string;
};

type EscaneoCodigoAutoResponse = OperativoResponse & {
  modo: 'AUTO';
  aprendiz: { nombreCompleto: string };
  vehiculo: VehiculoSeleccionable;
};

type EscaneoCodigoSeleccionResponse = {
  ok: boolean;
  modo: 'SELECCION';
  aprendiz: { nombreCompleto: string };
  codigo: string;
  vehiculos: VehiculoSeleccionable[];
};

type EscaneoCodigoResponse = EscaneoCodigoAutoResponse | EscaneoCodigoSeleccionResponse;

/**
 * FEATURE: MovementForm - Control de ingresos/salidas con escaneo híbrido.
 * Rediseñado con estética institucional SENA compacta y profesional.
 */
export const MovementForm = forwardRef<MovementFormHandle, MovementFormProps>(({ onSuccess, onError }, ref) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [motivo, setMotivo] = useState<string>('');
  const [showContingencia, setShowContingencia] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<FeedbackState>({ type: null, message: '' });
  const [multiVehiculos, setMultiVehiculos] = useState<VehiculoSeleccionable[] | null>(null);
  const [codigoPendiente, setCodigoPendiente] = useState<string>('');
  const [aprendizPendiente, setAprendizPendiente] = useState<string>('');
  const [feedbackOverlayOpen, setFeedbackOverlayOpen] = useState<boolean>(false);
  const [turnoIngresos, setTurnoIngresos] = useState<TurnoIngresoRow[]>([]);
  const [turnoLoading, setTurnoLoading] = useState<boolean>(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const motivoRef = useRef<HTMLInputElement>(null);
  const scannerBufferRef = useRef<string>('');
  const lastScanKeyAtRef = useRef<number>(0);

  useImperativeHandle(ref, () => ({
    activateManualMode: () => {
      setShowContingencia(true);
      setTimeout(() => motivoRef.current?.focus(), 100);
    }
  }));

  async function loadTurnoIngresos() {
    try {
      const res: any = await operativoService.resumenTurno();
      const ingresos = Array.isArray(res?.turno?.ingresos) ? (res.turno.ingresos as TurnoIngresoRow[]) : [];
      setTurnoIngresos(ingresos);
    } catch {
    } finally {
      setTurnoLoading(false);
    }
  }

  useEffect(() => {
    loadTurnoIngresos();
    const onEvento = () => loadTurnoIngresos();
    socketService.on('vehiculo_ingresado', onEvento);
    socketService.on('vehiculo_retirado', onEvento);
    const interval = window.setInterval(() => loadTurnoIngresos(), 5000);
    return () => {
      window.clearInterval(interval);
      socketService.off('vehiculo_ingresado', onEvento);
      socketService.off('vehiculo_retirado', onEvento);
    };
  }, []);

  useEffect(() => {
    const focusScanInput = () => {
      if (showContingencia) return;
      inputRef.current?.focus();
    };
    focusScanInput();
    const handleWindowFocus = () => focusScanInput();
    window.addEventListener('focus', handleWindowFocus);

    const handleGlobalKeys = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        focusScanInput();
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setInputValue('');
        setFeedback({ type: null, message: '' });
        setFeedbackOverlayOpen(false);
        setMultiVehiculos(null);
        setCodigoPendiente('');
        setAprendizPendiente('');
        setTimeout(() => focusScanInput(), 0);
        scannerBufferRef.current = '';
        lastScanKeyAtRef.current = 0;
        return;
      }
      if (showContingencia || multiVehiculos || feedback.type === 'loading') {
        scannerBufferRef.current = '';
        lastScanKeyAtRef.current = 0;
        return;
      }

      const active = document.activeElement as HTMLElement | null;
      const activeTag = active?.tagName?.toUpperCase() ?? '';
      const isEditable = activeTag === 'INPUT' || activeTag === 'TEXTAREA' || Boolean((active as any)?.isContentEditable);
      const scanFocused = active === inputRef.current;

      if (isEditable && !scanFocused) {
        scannerBufferRef.current = '';
        lastScanKeyAtRef.current = 0;
        return;
      }

      const isChar = e.key.length === 1 && /^[0-9a-zA-Z-]$/.test(e.key);
      const now = Date.now();
      const last = lastScanKeyAtRef.current;
      const gap = last ? now - last : 0;

      if (!scanFocused && isChar) {
        if (gap > 200) scannerBufferRef.current = '';
        lastScanKeyAtRef.current = now;
        scannerBufferRef.current += e.key;
        focusScanInput();
        return;
      }

      if (!scanFocused && e.key === 'Enter') {
        const buffered = scannerBufferRef.current.replace(/[- ]/g, '').toUpperCase();
        scannerBufferRef.current = '';
        lastScanKeyAtRef.current = 0;
        if (!buffered.length) return;
        e.preventDefault();
        focusScanInput();
        setInputValue(buffered);
        handleAction('codigo', buffered);
      }
    };

    window.addEventListener('keydown', handleGlobalKeys);

    let timeout: ReturnType<typeof setTimeout> | undefined;
    if (feedback.type === 'success') {
      timeout = setTimeout(() => {
        setFeedback({ type: null, message: '' });
        setFeedbackOverlayOpen(false);
      }, 4000);
    }

    return () => {
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('keydown', handleGlobalKeys);
      if (timeout) clearTimeout(timeout);
    };
  }, [feedback.type, showContingencia, multiVehiculos]);

  const clearState = () => {
    setInputValue('');
    setMotivo('');
    setShowContingencia(false);
    setFeedback({ type: null, message: '' });
    setFeedbackOverlayOpen(false);
    setMultiVehiculos(null);
    setCodigoPendiente('');
    setAprendizPendiente('');
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  async function handleAction(action: 'entrada' | 'salida' | 'manual' | 'codigo', value?: string) {
    const targetValue = String(value ?? inputValue).trim();
    const identificacionLimpia = targetValue.replace(/[- ]/g, '').toUpperCase();

    // Validaciones previas
    if (action !== 'codigo') {
      if (!targetValue) {
        setFeedback({ type: 'error', message: 'Falta Placa o Documento' });
        setFeedbackOverlayOpen(true);
        return;
      }
      if (action === 'manual' && !motivo.trim()) {
        setFeedback({ type: 'error', message: 'Debe indicar el motivo' });
        setFeedbackOverlayOpen(true);
        return;
      }
    }

    setFeedback({ type: 'loading', message: 'Procesando...' });
    
    try {
      const upper = targetValue.toUpperCase();

      switch (action) {
        case 'entrada':
          const resEntrada: OperativoResponse = await operativoService.registrarEntrada(upper);
          setFeedback({ 
            type: 'success', 
            message: `¡AUTORIZADO! Bahía: ${resEntrada.bahia}` 
          });
          setFeedbackOverlayOpen(true);
          onSuccess(`Ingreso: ${targetValue} -> ${resEntrada.bahia}`);
          loadTurnoIngresos();
          clearState();
          break;

        case 'salida':
          await operativoService.registrarSalida(upper);
          setFeedback({ 
            type: 'success', 
            message: `¡SALIDA REGISTRADA!` 
          });
          setFeedbackOverlayOpen(true);
          onSuccess(`Salida: ${targetValue}`);
          loadTurnoIngresos();
          clearState();
          break;

        case 'manual':
          await operativoService.registrarIngresoManual(identificacionLimpia, motivo);
          setFeedback({ type: 'success', message: '¡REGISTRO MANUAL EXITOSO!' });
          setFeedbackOverlayOpen(true);
          onSuccess(`Manual: ${identificacionLimpia}`);
          loadTurnoIngresos();
          clearState();
          break;

        case 'codigo':
          if (!identificacionLimpia) return;
          const res: EscaneoCodigoResponse = await operativoService.escanearCodigo(identificacionLimpia);
          if (res.ok) {
            if (res.modo === 'AUTO') {
              setFeedback({ 
                type: 'success', 
                message: `¡AUTORIZADO! ${res.aprendiz.nombreCompleto}` 
              });
              setFeedbackOverlayOpen(true);
              onSuccess(`Ingreso Automático: ${res.vehiculo.placa}`);
              loadTurnoIngresos();
              clearState();
            } else if (res.modo === 'SELECCION') {
              setMultiVehiculos(res.vehiculos);
              setCodigoPendiente(res.codigo);
              setAprendizPendiente(res.aprendiz.nombreCompleto);
              setFeedback({ type: null, message: '' });
            }
          }
          break;
      }
    } catch (err: any) {
      const msg = err.response?.data?.mensaje || err.message || 'ERROR';
      setFeedback({ type: 'error', message: msg.toUpperCase() });
      setFeedbackOverlayOpen(true);
      onError(msg);
    }
  }

  async function handleConfirmarMulti(placa: string) {
    setFeedback({ type: 'loading', message: 'Procesando...' });
    try {
      const res = await operativoService.confirmarIngresoMultivehiculo(codigoPendiente, placa);
      setFeedback({ 
        type: 'success', 
        message: `¡AUTORIZADO! Bahía: ${res.bahia}` 
      });
      setFeedbackOverlayOpen(true);
      onSuccess(`Ingreso Multi: ${placa} -> ${res.bahia}`);
      loadTurnoIngresos();
      clearState();
    } catch (err: any) {
      const msg = err.response?.data?.mensaje || 'ERROR';
      setFeedback({ type: 'error', message: msg.toUpperCase() });
      setFeedbackOverlayOpen(true);
      onError(msg);
    }
  }

  return (
    <div className="space-y-6 relative">
      {/* Feedback Overlay Masivo - Ahora más institucional y sobrio */}
      {feedbackOverlayOpen && (
        <div 
          className={`
            fixed inset-0 z-[100] flex items-center justify-center p-6
            animate-in fade-in duration-200 backdrop-blur-sm
            ${feedback.type === 'success' ? 'bg-[#012E25]/95' : 'bg-red-900/95'}
          `}
          onClick={clearState}
        >
          <div className="text-center text-white max-w-2xl space-y-6">
            <div className="flex justify-center">
              {feedback.type === 'success' ? (
                <div className="w-24 h-24 bg-[#39B000] rounded-full flex items-center justify-center shadow-lg shadow-green-900/20">
                  <CheckCircle2 size={60} strokeWidth={2} />
                </div>
              ) : (
                <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-900/20">
                  <XCircle size={60} strokeWidth={2} />
                </div>
              )}
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight uppercase">
              {feedback.message}
            </h2>
            <p className="text-sm font-bold opacity-40 uppercase tracking-[0.2em]">
              ESC o toque para cerrar
            </p>
          </div>
        </div>
      )}

      {/* Selector de Múltiples Vehículos */}
      {multiVehiculos && (
        <div className="fixed inset-0 z-[110] bg-[#012E25]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#121212] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-100 dark:border-white/5 transition-colors duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-[#39B000] uppercase tracking-widest mb-1">Selección de Vehículo</p>
                <h3 className="text-lg font-bold text-[#012E25] dark:text-white">{aprendizPendiente}</h3>
              </div>
              <button onClick={clearState} className="p-2 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-400 rounded-lg transition-all">
                <XCircle size={20} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 gap-3">
              {multiVehiculos.map((v) => (
                <button
                  key={v.placa}
                  onClick={() => handleConfirmarMulti(v.placa)}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-white/5 hover:border-[#39B000] hover:bg-green-50/30 dark:hover:bg-[#39B000]/10 transition-all group text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-[#39B000] group-hover:text-white transition-all">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-base font-bold text-[#012E25] dark:text-white">{v.placa}</p>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{v.tipoVehiculo} • {v.color}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input de Escaneo Compacto */}
      <div className="relative group max-w-xl mx-auto">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <ScanLine className={`w-5 h-5 transition-colors ${inputValue ? 'text-[#39B000]' : 'text-gray-300 dark:text-gray-600 group-focus-within:text-[#39B000]'}`} />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="ESCANEAR O ESCRIBIR PLACA..."
          autoComplete="off"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value.toUpperCase())}
          className={`
            w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-white/5 border-2 rounded-xl
            text-lg font-bold tracking-widest transition-all outline-none
            ${feedback.type === 'error' ? 'border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/20 text-red-600' : 'border-transparent focus:border-[#39B000] focus:bg-white dark:focus:bg-[#121212] text-[#012E25] dark:text-white'}
          `}
        />
        <div className="absolute inset-y-0 right-4 flex items-center">
          <div className="px-2 py-1 bg-gray-200 dark:bg-white/10 rounded text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase">
            F2
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
        <button
          onClick={() => handleAction('entrada')}
          disabled={feedback.type === 'loading'}
          className="flex flex-col items-center justify-center gap-2 p-6 bg-[#39B000] text-white rounded-2xl hover:bg-[#007832] transition-all shadow-lg shadow-green-900/10 active:scale-95 group"
        >
          <CheckCircle2 size={24} className="group-hover:scale-110 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Entrada</span>
        </button>
        <button
          onClick={() => handleAction('salida')}
          disabled={feedback.type === 'loading'}
          className="flex flex-col items-center justify-center gap-2 p-6 bg-[#012E25] text-white rounded-2xl hover:bg-black transition-all shadow-lg shadow-black/10 active:scale-95 group"
        >
          <XCircle size={24} className="group-hover:scale-110 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Salida</span>
        </button>
      </div>

      {/* Actividad Reciente Compacta */}
      <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-white/5">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Actividad Reciente</h4>
          <span className="text-[9px] font-bold text-[#39B000] uppercase tracking-widest animate-pulse">En vivo</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {turnoLoading ? (
            Array(2).fill(0).map((_, i) => <div key={i} className="h-14 bg-gray-50 dark:bg-white/5 rounded-xl animate-pulse" />)
          ) : turnoIngresos.length === 0 ? (
            <div className="col-span-full py-6 text-center border border-dashed border-gray-100 dark:border-white/5 rounded-xl">
              <p className="text-[10px] font-bold text-gray-300 dark:text-gray-700 uppercase tracking-widest">Sin registros recientes</p>
            </div>
          ) : (
            turnoIngresos.slice(0, 4).map((ingreso, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/5 rounded-xl hover:border-gray-200 dark:hover:border-white/10 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center text-[#39B000] font-bold text-[10px] group-hover:bg-[#39B000] group-hover:text-white transition-all">
                  {ingreso.placa.substring(0, 2)}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold text-[#012E25] dark:text-white leading-none truncate">{ingreso.placa}</p>
                  <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 mt-1 uppercase truncate">
                    {ingreso.tipoVehiculo} • {ingreso.horaIngreso}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Registro Manual (Contingencia) */}
      <div className={`
        overflow-hidden transition-all duration-300 rounded-xl
        ${showContingencia ? 'max-h-[400px] border border-[#39B000]/20 bg-green-50/20 dark:bg-[#39B000]/5 p-6' : 'max-h-0'}
      `}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#012E25] dark:text-white uppercase tracking-widest flex items-center gap-2">
              <AlertCircle size={14} /> Contingencia Manual
            </p>
            <span className="text-[8px] font-bold text-[#39B000] uppercase">Uso exclusivo sin lector QR</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Placa o Documento</label>
              <input
                type="text"
                placeholder="Identificación..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 focus:border-[#39B000] rounded-lg outline-none text-xs font-bold transition-all dark:text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Motivo del registro</label>
              <input
                ref={motivoRef}
                type="text"
                placeholder="Ej: Falla carnet, visitante..."
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 focus:border-[#39B000] rounded-lg outline-none text-xs font-bold transition-all dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button 
              onClick={() => { setShowContingencia(false); setMotivo(''); }} 
              className="px-4 py-2 text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={() => handleAction('manual')} 
              className="px-8 py-2 bg-[#39B000] text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-green-900/10 active:scale-95 transition-all"
            >
              Confirmar Registro
            </button>
          </div>
        </div>
      </div>

      {!showContingencia && (
        <button 
          onClick={() => setShowContingencia(true)}
          className="w-full py-3 border border-dashed border-gray-100 dark:border-white/10 hover:border-gray-200 dark:hover:border-white/20 rounded-xl text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest transition-all"
        >
          + Activar Registro Manual
        </button>
      )}
    </div>
  );
});

