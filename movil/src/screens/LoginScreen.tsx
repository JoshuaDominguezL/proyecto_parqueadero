import React from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';
import { colors, fonts, espacios } from '../theme/senaTheme';

export default function LoginScreen({ navigation }: any) {
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Iniciar Sesion</Text>

            <Text style={styles.label}>Correo o N° Identificación</Text>
            <TextInput
                style={styles.input}
                placeholder="example@gmail.com"
                placeholderTextColor='#aaa'
            />

            <Text style={styles.label}>Contraseña</Text>
            <TextInput
                style={styles.input}
                placeholder="••••••••••"
                placeholderTextColor="#aaa"
                secureTextEntry={true}
            />

            <TouchableOpacity style={styles.boton}>
                <Text style={styles.botonTexto}>Iniciar</Text>
            </TouchableOpacity>
            
            <View style={styles.filaInferior}>
                <Text style={styles.link}>¿Olvido su Contraseña?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.enlace}>Registrarse</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.blanco,
        padding: espacios.grande,
        justifyContent: 'center',
    },
    titulo: {
        fontSize: fonts.titulo,
        fontWeight: 'bold',
        marginBottom: espacios.grande,
        color: colors.negro,
    },
    label: {
        fontSize: fonts.normal,
        color: colors.verde,
        fontWeight: 'bold',
        marginBottom: espacios.pequeno,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: colors.gris,
        marginBottom: espacios.medio,
        fontSize: fonts.medio,
        paddingVertical: espacios.pequeno,
        color: colors.negro,
    },
    boton: {
        backgroundColor: colors.verde,
        borderRadius: 25,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: espacios.pequeno,
        marginBottom: espacios.medio,
    },
    botonTexto: {
        color: colors.blanco,
        fontSize: fonts.medio,
        fontWeight: 'bold',
    },
    link: {
        color: colors.verde,
        textAlign: 'center',
        fontSize: fonts.normal,
    },
    filaInferior: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    enlace: {
        color: colors.verde,
        fontWeight: 'bold',
        fontSize: fonts.normal,
    },
});