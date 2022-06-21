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
			alert('Debe ingresar un titulo para la tarea');
			return false;
		}

		if (this.nuevaTarea.get('duracion').value <= 0) {
			alert('La duración no ha sido introducida');
			return false;
		}

		return true;
	}

	agregar() {
		if(this.verificar()){
			this.tareas.push(new Tarea(
				this.obtenerID(),
				this.nuevaTarea.get('titulo').value,
				this.nuevaTarea.get('duracion').value,
				));

			//Vaciamos nuestras variables del form
			this.nuevaTarea.get('titulo').reset('');
			this.nuevaTarea.get('duracion').reset('');
		}
	}

	obtenerID():number{
		return this.tareas.length + 1;
	}

}
