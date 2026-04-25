import React from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';

export default function LoginScreen() {
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

            <Text style={styles.link}>¿Olvido su Contraseña?</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 30,
        justifyContent: 'center',
    },
    titulo: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#000',
    },
    label: {
        fontSize: 14,
        color: '#39b54a',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 20,
        fontSize: 16,
        paddingVertical: 5,
        color: '#000',
    },
    boton: {
        backgroundColor: '#39b54a',
        borderRadius: 25,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop:10,
        marginBottom:20,
    },
    botonTexto:{
        color: '#fff',
        fontSize:16,
        fontWeight:'bold',
    },
    link:{
        color:'#39b54a',
        textAlign:'center',
        fontSize:14,
    },
});