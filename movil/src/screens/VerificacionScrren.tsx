import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { colors, fonts, espacios } from '../theme/senaTheme';

export default function VerificacionScreen({ navigation }: any) {
    const [metodo, setMetodo] = useState<'correo' | 'sms' | null>(null);

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.atras}>Volver</Text>
            </TouchableOpacity>

            <Text style={styles.titulo}>Verificacion</Text>
            <Text style={styles.subtitulo}>
                Seleccione el metodo de verificacion de su preferencia para confirmar su identidad.
            </Text>

            <TouchableOpacity
                style={styles.opcionFila}
                onPress={() => setMetodo('correo')}
            >
                <Text style={styles.opcionTexto}>Correo</Text>
                <View style={[styles.radio, metodo === 'correo' && styles.radioActivo]} />
            </TouchableOpacity>

            <TouchableOpacity
            style={styles.opcionFila}
            onPress={()=>setMetodo('sms')}
            >
                <Text style={styles.opcionTexto}>SMS al Numero Telefonico</Text>
                <View style={[styles.radio, metidi === 'sms' && styles.radioActivo]} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.boton}>
                <Text style={styles.botonTexto}>Confitmar Metodo</Text>
            </TouchableOpacity>

            
        </View>
    )
}

const styles = StyleSheet.create({})