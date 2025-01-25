import { Dialog, Button, TextField } from '@mui/material';
import { Form, Formik } from 'formik';
import styles from './page.module.scss';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateEmpleado } from '../../../api/empleado';

export const ModalEdit = ({ handleClose, openModal, empleado }: any) => {
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: (values: any) => updateEmpleado(empleado.id, values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['empleados'] });
            handleClose();
        },
        onError: (error) => {
            console.error('Error:', error);
        }
    });

    const handleSubmit = (values: any) => {
        mutate(values);
    };

    return (
        <>
            <Dialog open={openModal} maxWidth="md" fullWidth={false} onClose={handleClose}>
                <div className={styles.modalContainer}>
                    <h3>Editar Empleado</h3>
                    <Formik
                        initialValues={{
                            nombre: empleado ? empleado?.nombre : '',
                            edad: empleado ? empleado?.edad : '',
                            puesto: empleado ? empleado?.puesto : '',
                        }}
                        onSubmit={(values: any) => handleSubmit(values)}
                    >
                        {({ handleSubmit, handleChange, values }) => (
                            <Form>
                                <div className={styles.formContainer}>
                                    <TextField
                                        label="Nombre"
                                        name="nombre"
                                        value={values.nombre}
                                        onChange={handleChange}
                                    />
                                    <TextField
                                        label="Edad"
                                        name="edad"
                                        value={values.edad}
                                        onChange={handleChange}
                                    />
                                    <TextField
                                        label="Puesto"
                                        name="puesto"
                                        value={values.puesto}
                                        onChange={handleChange}
                                    />
                                    <div className={styles.buttonContainer}>
                                        <Button variant="contained" color="primary" type="submit">
                                            Editar
                                        </Button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>

                </div>
            </Dialog>
        </>
    );
};
