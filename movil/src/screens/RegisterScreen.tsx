import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { colors, fonts, espacios } from '../theme/senaTheme';

export default function RegisterScreen({ navigation }: any) {
    const [aceptaTerminos, setAceptaTerminos] = useState(false);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.titulo}>Registro</Text>

            <Text style={styles.label}>Correo</Text>
            <TextInput
                style={styles.input}
                placeholder='Ingresar Correo'
                placeholderTextColor={colors.gris}
            />

            <Text style={styles.label}>Contraseña</Text>
            <TextInput
                style={styles.input}
                placeholder="Ingresar Contraseña"
                placeholderTextColor={colors.gris}
                secureTextEntry={true}
            />

            <Text style={styles.label}>Nombres y Apellido</Text>
            <TextInput
                style={styles.input}
                placeholder='Nombres y apellidos'
                placeholderTextColor={colors.gris}
            />

            <Text style={styles.label}>Tipo de Documento</Text>
            <TextInput
                style={styles.input}
                placeholder="Tipo de documento"
                placeholderTextColor={colors.gris}
            />

            <Text style={styles.label}>Numero de Documento</Text>
            <TextInput
                style={styles.input}
                placeholder="Numero de documento"
                placeholderTextColor={colors.gris}
            />

            <Text style={styles.label}>Numero de Telefonico</Text>
            <TextInput
                style={styles.input}
                placeholder="Numero de telefonico"
                placeholderTextColor={colors.gris}
            />

            <View style={styles.linkFila}>
                <TouchableOpacity
                    style={styles.checkboxFila}
                    onPress={() => setAceptaTerminos(!aceptaTerminos)}
                >
                    <View style={[styles.checkbox, aceptaTerminos && styles.checkboxActivo]} />
                </TouchableOpacity>
                <Text style={[styles.checkboxTexto]}>
                    {' '}Acepto los <Text style={styles.enlace}>Terminos de Servicio</Text> y la{' '}
                    <Text style={styles.enlace}>Politica de Privaciodad</Text>
                </Text>
            </View>


            <TouchableOpacity style={styles.boton}>
                <Text style={styles.botonTexto}>Continuar</Text>
            </TouchableOpacity>

            <View style={styles.linkFila}>
                <Text style={styles.linkTexto}>¿Tienes una cuenta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.enlace}>Iniciar sesion</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.blanco,
        padding: espacios.grande,
        paddingTop: 60,
        paddingBottom: 40,
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

    checkboxFila: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: espacios.medio,
        gap: 10,
    },

    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: colors.verde,
        borderRadius: 4,
    },

    checkboxActivo: {
        backgroundColor: colors.verde,
    },

    checkboxTexto: {
        fontSize: fonts.normal,
        color: colors.negro,
        flex: 1,
    },

    enlace: {
        color: colors.verde,
        fontWeight: 'bold',
        display: 'flex',
    },

    boton: {
        backgroundColor: colors.verde,
        borderRadius: 25,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: espacios.medio,
    },

    botonTexto: {
        color: colors.blanco,
        fontSize: fonts.medio,
        fontWeight: 'bold',
    },

    linkFila: {
        flexDirection: 'row',
        justifyContent: 'center',
        textAlign: 'center',
        marginTop: espacios.pequeno,
    },

    linkTexto: {
        fontSize: fonts.normal,
        color: colors.negro,
    }
});