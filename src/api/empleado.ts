import axios from "axios";

const BASE_URL = 'http://localhost:3000';

export const fetchEmpleados = async () => {
    const response = await axios.get(`${BASE_URL}/api/empleados`);
    if(!response.data){
        throw new Error("error feching data");
    }
    return response.data;
};

export const createEmpleado = async (empleado: any) => {
    const response = await axios.post(`${BASE_URL}/api/empleados`, empleado);
    if(!response.data){
        throw new Error("error creating empleado");
    }
    return response.data;
}

export const updateEmpleado = async (id: string, empleado: any) => {
    console.log("llega antes de la llamada")
    const response = await axios.put(`${BASE_URL}/api/empleados/${id}`, empleado);
    console.log("llega despues de la llamada")
    if(!response.data){
        throw new Error("error updating empleado");
    }
    return response.data;
}

export const deleteEmpleado = async (id: string) => {
    const response = await axios.delete(`${BASE_URL}/api/empleados/${id}`);
    if(!response.data){
        throw new Error("error deleting empleado");
    }
    return response.data;
}
