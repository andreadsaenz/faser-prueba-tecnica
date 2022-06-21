import { Component } from '@angular/core';
import { AppService } from './app.service';
import { Tarea } from './tarea';
import { FormControl, FormGroup} from '@angular/forms';

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

	constructor(
		public service: AppService,
	) { }

	ngOnInit() {
		this.obtenerTareas();
	}

	async obtenerTareas() {
		this.tareas = await this.service.obtenerTareas();
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
		if(this.verificar()){
			//Agregar una nueva tarea si el valor de "Verificar" es verdadero
			this.tareas.push(new Tarea(
				this.obtenerID(),
				this.nuevaTarea.get('titulo').value,
				this.nuevaTarea.get('duracion').value,
				false
				));

			// Eliminar datos residuales de form	
			this.nuevaTarea.get('titulo').reset('');
			this.nuevaTarea.get('duracion').reset('');
		}
	}

	//recuperar numero id
	obtenerID():number{
		return this.tareas.length + 1;
	}

	//¿Como eliminar una tarea a la vez?
	eliminar(tarea: Tarea){
		if(confirm(`¿Deseas eliminar la tarea "${tarea.titulo}" con duración de "${tarea.minutos}" minutos ?`) == true){
			tarea.eliminada = true;
		}
	}

}
