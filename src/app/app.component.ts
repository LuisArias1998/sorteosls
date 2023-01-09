import { Component, OnInit } from '@angular/core';
import { IBoletos } from './models/IBoletos';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import Swal from 'sweetalert2'
import { SendEmailService } from './services/send-email.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'sorteos-ls';
  boletos: IBoletos[] = [];
  contacto: FormGroup;
  boletosAOcupar: string[] = [];


  constructor(private fb: FormBuilder, private _emailService: SendEmailService) {
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
    this.boletosAOcupar.forEach(bao => {
      this.boletos.forEach(b => {
        if (bao == b.id) {
          b.nombre = this.contacto.value.nombre;
          b.celular = this.contacto.value.whatsapp;
          b.municipio_cd = this.contacto.value.municipio_cd;
          b.estado = this.contacto.value.estado;
          b.apellidos = this.contacto.value.apellido;

          this._emailService.postClient(b).then((data) => {
            this._emailService.sendEmail(b).then((data) => {
              console.log(JSON.stringify(data))
            }).catch(err => { console.log('Promise send email rejected with: ' + JSON.stringify(err)) })
          }).catch(err => { console.log('Promise add client rejected with: ' + JSON.stringify(err)); })

        }
      })
    })
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Número(s) apartado(s)',
      showConfirmButton: false,
      timer: 1500
    })
    this.boletosAOcupar = [];
  }
  setBoleto(boletoSelec: string) {
    if (this.boletosAOcupar.findIndex(b => b == boletoSelec) != -1) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ya tienes este boleto seleccionado',
        confirmButtonColor: '#008000',
        confirmButtonText: 'Aceptar'
      })
    } else {
      this.boletosAOcupar.push(boletoSelec)

    }
    console.log(this.boletosAOcupar);
  }
  removeBoleto(boletoSelec: string) {
    this.boletosAOcupar = this.boletosAOcupar.filter(b => b != boletoSelec)
  }
  async ngOnInit() {
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
    let clients: IBoletos[] = await this._emailService.getClients();
    clients.forEach(c => {
      this.boletos.forEach(b => {
        if(c.id==b.id){
          b.nombre = c.nombre;
          b.celular = c.celular;
          b.municipio_cd = c.municipio_cd;
          b.estado = c.estado;
          b.apellidos = c.apellidos;
        }
      })
    })
  }


}
