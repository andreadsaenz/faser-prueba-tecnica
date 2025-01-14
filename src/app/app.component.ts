import { Component } from '@angular/core';
import { AppService } from './app.service';
import { Tarea } from './tarea';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	tareas: Tarea[];

	//variables de formulario temporal
	nuevaTarea: FormGroup = new FormGroup({
		titulo: new FormControl(''),
		duracion: new FormControl('')
	});

	//¿Todas las tareas seleccionadas?
	todas = false

	constructor(
		public service: AppService,
	) { }

	ngOnInit() {
		this.obtenerTareas();
	}

	async obtenerTareas() {
		this.tareas = await this.service.obtenerTareas();
	}

	//¿Como ordenar una tabla por medio de la duración de la tarea?
	ordenar(orden: boolean) {
		if (orden == false) {
			//Orden descendente
			this.tareas.sort((tarea1, tarea2) => (tarea1.minutos < tarea2.minutos) ? 1 : -1);
		} else {
			//Orden ascendente
			this.tareas.sort((tarea1, tarea2) => (tarea1.minutos > tarea2.minutos) ? 1 : -1);
		}
	}

	//¿el form esta lleno?
	verificar(): Boolean {
		if (this.nuevaTarea.get('titulo').value == '') {
			alert('Debe ingresar un titulo para la tarea, intente de nuevo');
			this.nuevaTarea.get('duracion').reset('');

			return false;
		}

		if (this.nuevaTarea.get('duracion').value <= 0) {
			alert('La duración no ha sido introducida, intente de nuevo');
			this.nuevaTarea.get('titulo').reset('');
			return false;
		}

		return true;
	}

	agregar() {
		if (this.verificar()) {
			//Agregar una nueva tarea si el valor de "Verificar" es verdadero
			this.tareas.push(new Tarea(
				this.obtenerID(),
				this.nuevaTarea.get('titulo').value,
				this.nuevaTarea.get('duracion').value,
				false, false
			));

			// Eliminar datos residuales de form	
			this.nuevaTarea.get('titulo').reset('');
			this.nuevaTarea.get('duracion').reset('');
		}
	}

	//recuperar numero id
	obtenerID(): number {
		return this.tareas.length + 1;
	}

	//¿Como eliminar una tarea a la vez?
	eliminar(tarea: Tarea) {
		if (confirm(`¿Deseas eliminar la tarea "${tarea.titulo}" con duración de "${tarea.minutos}" minutos ?`) == true) {
			tarea.eliminada = true;
		}
	}

	//¿Es destacada?
	seleccionarTarea(tarea: Tarea){
		tarea.seleccionada = !tarea.seleccionada;
	}

	all(){
		if(this.todas == true){
			//recorrer arreglo de tareas
			for(let tarea of this.tareas){
				if(tarea.eliminada == false){
					tarea.seleccionada = false
				} 
			} this.todas = false;
		}else{
			for(let tarea of this.tareas){
				if(tarea.eliminada == false){
					tarea.seleccionada = true
				} 
			} this.todas = true;
		}
	}
}
