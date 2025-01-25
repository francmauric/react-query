import { useQuery, useMutation } from "@tanstack/react-query";
import { deleteEmpleado, fetchEmpleados } from "../../api/empleado";
import { Briefcase, Calendar, UserRound, Search, UserPlus } from 'lucide-react';

import styles from './page.module.scss';
import { ModalAdd } from "./modalAdd/ModalAdd";
import { ModalEdit } from "./modalEdit/ModalEdit";
import { useState } from "react";
import { Button } from "@mui/material";





export const Empleados = () => {
    const [openModal, setOpenModal] = useState<any>(false);
    const [empleado, setEmpleado] = useState<any>(null);
    const { data: empleados, isLoading, isError, refetch } = useQuery({
        queryKey: ['empleados'],
        queryFn: fetchEmpleados,
    });
    //console.log(empleados)

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteEmpleado(id),
        onSuccess: () => {
            refetch();
        },
        onError: (error) => {
            console.error('Error al eliminar empleado:', error);
            // Aquí podrías agregar una notificación de error
        }
    });

    const handleOpen = (empleado: any) => {
        console.log(empleado)
        console.log("open modal")
        setEmpleado(empleado);
        setOpenModal(true);
    }
    const handleClose = () => {
        setOpenModal(false);
    }

    const handleDelete = (id: string) => {
        deleteMutation.mutate(id);
    }

    return (<div>
        <h1>Empleados</h1>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error fetching employees</p>}
        <div className={styles.employeesContainer}>
            <div className={styles.cardsGrid}>
                {empleados?.map((empleado: any) => (
                    <div key={empleado.id} className={styles.empleadoCard}>
                        <div onClick={() => handleOpen(empleado)}>

                            <div className={styles.cardHeader}>
                                <div className={styles.avatar}>{empleado.nombre[0]}</div>
                                <span className={styles.roleBadge}>{empleado.puesto}</span>
                            </div>
                            <div className={styles.cardBody}>
                                <h2>{empleado.nombre}</h2>
                                <div className={styles.infoRow}>
                                    <Briefcase size={16} />
                                    <span>ID: {empleado.id}</span>
                                </div>
                                <div className={styles.infoRow}>
                                    <Calendar size={16} />
                                    <span>{empleado.edad} años</span>
                                </div>
                            </div>
                        </div>

                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleDelete(empleado.id)}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
                        </Button>
                    </div>
                ))}
            </div>
            <ModalAdd />
            <ModalEdit handleClose={handleClose} openModal={openModal} empleado={empleado} refetch={refetch} />
        </div>

    </div>)
}

