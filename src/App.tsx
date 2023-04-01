import { useCallback, useEffect, useMemo, useState } from 'react';
import { markdownTable } from 'markdown-table';
import { FormularioVuelo } from './components/FormularioVuelo';
import { Vuelo, MAPA_PRIORIDAD, COLUMNAS } from './schema';
import { obtenerTiempo, obtenerEstado, generarVuelo } from './utils';

const DIA_ACTUAL = Intl.DateTimeFormat('es-ES', {
	weekday: 'short',
	year: 'numeric',
	month: 'short',
	day: 'numeric',
}).format(new Date());

type Estado = 'MENU' | 'AGREGAR' | 'LISTA' | 'SIMULACION'

export default function App() {
	const [tiempoActual, setTiempoActual] = useState(obtenerTiempo('00:00'));
	const [vuelos, setVuelos] = useState<Vuelo[]>([]);
	const [estado, setEstado] = useState<Estado>('MENU');
	const [ultimoVueloSimulado, setUltimoVueloSimulado] = useState<
		Vuelo | undefined
	>(undefined);

	const agregarVuelo = useCallback((vuelo: Vuelo) => {
		setVuelos((vuelosCola) => {
			const nuevosVuelos = [...vuelosCola, vuelo];
			// Ordenar por hora y prioridado
			nuevosVuelos.sort((a, b) => {
				const tiempoA = obtenerTiempo(a.hora).getTime();
				const tiempoB = obtenerTiempo(b.hora).getTime();
				if (tiempoA === tiempoB) {
					return (
						MAPA_PRIORIDAD[b.prioridad] -
						MAPA_PRIORIDAD[a.prioridad]
					);
				}
				return tiempoA - tiempoB;
			});
			return nuevosVuelos;
		});
	}, []);

	const tablaVuelos = useMemo(() => {
		const vuelosConEstado = vuelos.map((vuelo, index) => {
			return {
				...vuelo,
				estado: obtenerEstado(vuelo, tiempoActual, false),
			};
		});
		return markdownTable([
			COLUMNAS,
			...vuelosConEstado.map((v) => Object.values(v)),
		]);
	}, [vuelos, tiempoActual]);

	// Generador de tiempo
	useEffect(() => {
		if (estado === 'SIMULACION' && vuelos.length > 0) {
			const intervalo = setInterval(() => {
				setTiempoActual((tiempo) => {
					if (
						tiempo.getTime() >= obtenerTiempo('23:59').getTime()
					)
						return tiempo;
					const nuevoTiempo = ultimoVueloSimulado
						? new Date(tiempo.getTime() + 60 * 1000)
						: obtenerTiempo(vuelos[0].hora);
					return nuevoTiempo;
				});
			}, 500);
			return () => clearInterval(intervalo);
		}
	}, [estado, vuelos, ultimoVueloSimulado]);

	// Reaccionar para quitar el ultimo vuelo simulado si este ya termino
	useEffect(() => {
		if (ultimoVueloSimulado) {
			const timeUltimoVuelo = obtenerTiempo(ultimoVueloSimulado.hora);
			const duracionVuelo = parseInt(ultimoVueloSimulado.duracion);
			if (
				tiempoActual.getTime() - timeUltimoVuelo.getTime() >=
				duracionVuelo * 60 * 1000
			) {
				setUltimoVueloSimulado(undefined);
			}
		}
	}, [tiempoActual, ultimoVueloSimulado, vuelos]);

	// Reaccionar a los cambios de tiempo para sacar los vuelos pendientes a la pista
	useEffect(() => {
		if (vuelos.length > 0) {
			const tiempoVuelo = obtenerTiempo(vuelos[0].hora);
			if (
				tiempoVuelo.getTime() <= tiempoActual.getTime() &&
				!ultimoVueloSimulado
			) {
				const nuevosVuelos = [...vuelos];
				const ultimo = nuevosVuelos.shift();
				if (ultimo) {
					ultimo.hora = `${tiempoActual.getHours()}:${tiempoActual.getMinutes()}`;
					setUltimoVueloSimulado(ultimo);
				}
				setVuelos(nuevosVuelos);
			}
		}
	}, [tiempoActual, vuelos, ultimoVueloSimulado]);

	return (
		<div className='bg-primary-900 p-4'>
			<div className='flex justify-between text-primary-100'>
				<div className='flex text-2xl'>
					<span className='bg-red-500 h-8 w-8 mt-1 rounded-full mr-2'></span>
					<span className='bg-yellow-500 h-8 w-8 mt-1 rounded-full mr-2'></span>
					<span className='bg-green-500 h-8 w-8 mt-1 rounded-full mr-4 '></span>
					<h1 className='font-mono'>
						¡Bienvenido al aeropuerto de John!, hoy tenemos {vuelos.length} vuelos
					</h1>
				</div>
				<div className='flex'>
					<div className='flex capitalize text-2xl'>
						<span>{DIA_ACTUAL}</span>
						<span className='ml-2'>
							{tiempoActual.toLocaleTimeString()}
						</span>
					</div>
				</div>
			</div>
			{estado === 'MENU' && (
				<div className='flex flex-col mt-2 h-screen'>
					<div className='flex flex-col mt-2'>
						<button
							onClick={() => setEstado('AGREGAR')}
							className='bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300'
						>
							Agregar vuelo
						</button>
						<button
							onClick={() => {
								for (let i = 0; i < 10; i++) {
									agregarVuelo(generarVuelo());
								}
							}}
							className='bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 mt-2'
						>
							Agregar +10 vuelos aleatorios
						</button>
						<button
							onClick={() => setEstado('LISTA')}
							className='bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 mt-2'
						>
							Mostrar lista de vuelos
						</button>
						<button
							onClick={() => setEstado('SIMULACION')}
							className='bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 mt-2'
						>
							Ejecutar simulación
						</button>
					</div>
				</div>
			)}
			{estado === 'AGREGAR' && (
				<>
					<div className='flex flex-col mt-2'>
						<div className='flex flex-col mt-2'>
							<button
								onClick={() => setEstado('MENU')}
								className='bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300'
							>
								Volver
							</button>
						</div>
					</div>
					<div className='mx-auto h-screen'>
						<FormularioVuelo
							agregarVuelo={(data) => {
								agregarVuelo(data);
								setEstado('MENU');
							}}
						/>
					</div>
				</>
			)}
			{estado === 'LISTA' && (
				<>
					<div className='flex flex-col mt-2'>
						<button
							onClick={() => setEstado('MENU')}
							className='bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300'
						>
							Volver
						</button>
						<div className='flex flex-col mt-2'>
							<pre className='bg-gray-800 text-white font-mono p-4 rounded-lg'>
								{tablaVuelos}
							</pre>
						</div>
					</div>
				</>
			)}
			{estado === 'SIMULACION' && (
				<>
					<div className='flex flex-col mt-2'>
						{vuelos.length === 0 && (
							<button
								onClick={() => {
									setTiempoActual(obtenerTiempo('00:00'));
									setEstado('MENU');
								}}
								className='bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300'
							>
								Volver al menú
							</button>
						)}
						<div className='flex flex-col mt-2'>
							{ultimoVueloSimulado && (
								<div className='flex flex-col my-2'>
									<h1 className='font-mono text-white text-xl'>
										Último vuelo simulado
									</h1>
									<pre className='bg-gray-800 text-white font-mono p-4 text-lg rounded-lg'>
										{markdownTable([
											COLUMNAS,
											[
												...Object.values(
													ultimoVueloSimulado
												),
												obtenerEstado(
													ultimoVueloSimulado,
													tiempoActual,
													true
												),
											],
										])}
									</pre>
								</div>
							)}

							<pre className='bg-gray-800 text-white font-mono p-4 rounded-lg'>
								{tablaVuelos}
							</pre>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
