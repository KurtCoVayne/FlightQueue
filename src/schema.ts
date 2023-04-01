import { z } from "zod";

export const VueloModelo = z.object({
	numero: z.string().regex(/^[A-Z]{2}\d{4}$/, {
		message: 'El número de vuelo debe tener 2 letras y 4 números',
	}),
	origen: z.string().regex(/^[A-Z]{3}$/, {
		message: 'El código de origen debe tener 3 letras',
	}),
	destino: z.string().regex(/^[A-Z]{3}$/, {
		message: 'El código de destino debe tener 3 letras',
	}),
	tipoVuelo: z.enum(['LLEGADA', 'SALIDA'], {
		invalid_type_error: 'El tipo de vuelo debe ser LLEGADA o SALIDA',
	}),
	hora: z
		.string()
		.regex(
			/^(0\d|1\d|2[0-3]):[0-5]\d$/,
			'La hora debe tener el formato HH:MM'
		),
	duracion: z.string().regex(/\d+/, {
		message: 'La duración debe ser en minutos',
	}),
	prioridad: z.enum(['COMERCIAL', 'ESPECIAL', 'MILITAR', 'EMERGENCIA'], {
		invalid_type_error:
			'La prioridad debe ser COMERCIAL, ESPECIAL, MILITAR o EMERGENCIA',
	}),
});

export type Vuelo = z.infer<typeof VueloModelo>;

export const MAPA_PRIORIDAD = {
	COMERCIAL: 4,
	ESPECIAL: 3,
	MILITAR: 2,
	EMERGENCIA: 1,
};

export const COLUMNAS = [
	'Numero de vuelo',
	'Origen',
	'Destino',
	'Tipo',
	'Hora de salida',
	'Duración (min)',
	'Prioridad',
	'Estado',
];