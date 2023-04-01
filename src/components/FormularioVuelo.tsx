import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Vuelo, VueloModelo } from "../schema";

export function FormularioVuelo({
	agregarVuelo,
}: {
	agregarVuelo: (vuelo: Vuelo) => void;
}) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Vuelo>({ resolver: zodResolver(VueloModelo) });
	const onSubmit = (data: Vuelo) => {
		agregarVuelo(data);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className='flex flex-col mt-2'>
				<label className='text-primary-100'>Número de vuelo</label>
				<input
					{...register('numero')}
					className='bg-gray-800 text-primary-100 border border-gray-700 rounded-lg p-2 focus:outline-none focus:border-primary-500'
				/>
				{errors.numero && (
					<span className='text-red-500'>
						{errors.numero.message}
					</span>
				)}
			</div>
			<div className='flex flex-col mt-2'>
				<label className='text-primary-100'>Origen</label>
				<input
					{...register('origen')}
					className='bg-gray-800 text-primary-100 border border-gray-700 rounded-lg p-2 focus:outline-none focus:border-primary-500'
				/>
				{errors.origen && (
					<span className='text-red-500'>
						{errors.origen.message}
					</span>
				)}
			</div>
			<div className='flex flex-col mt-2'>
				<label className='text-primary-100'>Destino</label>
				<input
					{...register('destino')}
					className='bg-gray-800 text-primary-100 border border-gray-700 rounded-lg p-2 focus:outline-none focus:border-primary-500'
				/>
				{errors.destino && (
					<span className='text-red-500'>
						{errors.destino.message}
					</span>
				)}
			</div>
			<div className='flex flex-col mt-2'>
				<label className='text-primary-100'>Tipo de vuelo</label>
				<select
					{...register('tipoVuelo')}
					className='bg-gray-800 text-primary-100 border border-gray-700 rounded-lg p-2 focus:outline-none focus:border-primary-500'
				>
					<option value='LLEGADA'>Llegada</option>
					<option value='SALIDA'>Salida</option>
				</select>
				{errors.tipoVuelo && (
					<span className='text-red-500'>
						{errors.tipoVuelo.message}
					</span>
				)}
			</div>
			<div className='flex flex-col mt-2'>
				<label className='text-primary-100'>Hora</label>
				<input
					{...register('hora')}
					type='time'
					className='bg-gray-800 text-primary-100 border border-gray-700 rounded-lg p-2 focus:outline-none focus:border-primary-500'
				/>
				{errors.hora && (
					<span className='text-red-500'>{errors.hora.message}</span>
				)}
			</div>
			<div className='flex flex-col mt-2'>
				<label className='text-primary-100'>Duración</label>
				<input
					{...register('duracion')}
					className='bg-gray-800 text-primary-100 border border-gray-700 rounded-lg p-2 focus:outline-none focus:border-primary-500'
				/>
				{errors.duracion && (
					<span className='text-red-500'>
						{errors.duracion.message}
					</span>
				)}
			</div>
			<div className='flex flex-col mt-2'>
				<label className='text-primary-100'>Prioridad</label>
				<select
					{...register('prioridad')}
					className='bg-gray-800 text-primary-100 border border-gray-700 rounded-lg p-2 focus:outline-none focus:border-primary-500'
				>
					<option value='COMERCIAL'>Comercial</option>
					<option value='ESPECIAL'>Especial</option>
					<option value='MILITAR'>Militar</option>
					<option value='EMERGENCIA'>Emergencia</option>
				</select>
				{errors.prioridad && (
					<span className='text-red-500'>
						{errors.prioridad.message}
					</span>
				)}
			</div>
			<div className='flex flex-col mt-2'>
				<button
					type='submit'
					className='bg-primary-500 text-primary-100 border border-gray-700 rounded-lg p-2 focus:outline-none focus:border-primary-500'
				>
					Agregar
				</button>
			</div>
		</form>
	);
}
