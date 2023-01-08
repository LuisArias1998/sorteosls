import { Component, OnInit } from '@angular/core';
import { IBoletos } from './models/IBoletos';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import Swal from 'sweetalert2'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'sorteos-ls';
  boletos: IBoletos[] = [];
  contacto: FormGroup;
  boletoAOcupar: string = "";


  constructor(private fb: FormBuilder) {
    this.contacto = this.fb.group({
      whatsapp: ['', [Validators.required, Validators.min(1000000000), Validators.max(9999999999)]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      municipio_cd: ['', Validators.required],
      estado: ['', [Validators.required, Validators.maxLength(20)]]
    })
    this.contacto.controls['whatsapp']
  }
  onSubmit() {

    console.log(this.contacto.value);
    this.boletos.forEach(b=>{
      if(b.id==this.boletoAOcupar){
        b.nombre = this.contacto.value.nombre;
        b.celular = this.contacto.value.whatsapp;
        b.municipio_cd = this.contacto.value.municipio_cd;
        b.estado = this.contacto.value.estado;
        b.apellidos = this.contacto.value.apellido;
      }
    })
  }
  setBoleto(boletoSelec: string) {
    this.boletoAOcupar = boletoSelec
    console.log(this.boletoAOcupar);
  }
  ngOnInit() {
    //this.boletos[0].id="001"
    for (let i: number = 0; i < 1000; i++) {
      let numeroBoleto: string = "";
      if (i < 10) {
        numeroBoleto += "00" + i;
        console.log('object');
      } else if (i < 100) {
        numeroBoleto += "0" + i
      } else if (i >= 100) {
        numeroBoleto += i + ""
      }
      let boleto: IBoletos = {} as IBoletos;
      boleto.id = numeroBoleto;
      this.boletos.push(boleto)
    }
  }
}
