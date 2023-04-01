import { faker } from "@faker-js/faker";
import { Vuelo } from "./schema";

export const obtenerTiempo = (tiempo: string) => {
	const [hora, minutos] = tiempo.split(':');
	const tiempoActual = new Date();
	tiempoActual.setHours(Number(hora));
	tiempoActual.setMinutes(Number(minutos));
	tiempoActual.setSeconds(0);
	tiempoActual.setMilliseconds(0);
	return tiempoActual;
};

export const obtenerEstado = (vuelo: Vuelo, tiempoActual: Date, enPista: boolean) => {
	const tiempoVuelo = obtenerTiempo(vuelo.hora).getTime();
	const tiempoPista = tiempoActual.getTime();
	if (!enPista && tiempoPista <= tiempoVuelo) return 'A TIEMPO';
	if (!enPista && tiempoPista > tiempoVuelo) return 'ATRASADO';
	if (enPista && vuelo.tipoVuelo === 'LLEGADA') return 'ATERRIZANDO';
	if (enPista && vuelo.tipoVuelo === 'SALIDA') return 'DESPEGANDO';
};

export const generarVuelo = () => {
	return {
		numero: (
			faker.random.alphaNumeric(2) + faker.random.numeric(4)
		).toUpperCase(),
		origen: faker.random.alphaNumeric(3).toUpperCase(),
		destino: faker.random.alphaNumeric(3).toUpperCase(),
		tipoVuelo: ['LLEGADA', 'SALIDA'][Math.floor(Math.random() * 2)] as
			| 'LLEGADA'
			| 'SALIDA',
		hora:
			Math.floor(Math.random() * 24) +
			':' +
			Math.floor(Math.random() * 60),
		duracion: Math.floor(Math.random() * 8 + 3).toString(),
		prioridad: ['COMERCIAL', 'ESPECIAL', 'MILITAR', 'EMERGENCIA'][
			Math.floor(Math.random() * 4)
		] as 'COMERCIAL' | 'ESPECIAL' | 'MILITAR' | 'EMERGENCIA',
	};
};