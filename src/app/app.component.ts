import { Component, OnInit } from '@angular/core';
import { IBoletos } from './models/IBoletos';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import Swal from 'sweetalert2'
import { SendEmailService } from './services/send-email.service';
import { Router } from '@angular/router';
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
  messageToSend: string = 'Hey! Me gustaría apartar el boleto con número: ';
  messageToSendPlural: string = 'Hey! Me gustaría apartar los boletos con números: ';

  constructor(private fb: FormBuilder, private _emailService: SendEmailService, private router: Router) {
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
    console.log(this.boletosAOcupar);
    if (this.boletosAOcupar.length > 1) {
      this.boletosAOcupar.forEach(b => {
        this.messageToSendPlural += "[" + b + "] "
      })
    } else {
      this.messageToSend += " [" + this.boletosAOcupar[0] + "] ";
    }
    let error: Boolean = false;
    this.boletosAOcupar.forEach(async bao => {
      this.boletos.forEach(async b => {
        if (bao == b.id) {
          console.log('lo enconto');
          b.nombre = this.contacto.value.nombre;
          b.celular = this.contacto.value.whatsapp;
          b.municipio_cd = this.contacto.value.municipio_cd;
          b.estado = this.contacto.value.estado;
          b.apellidos = this.contacto.value.apellido;

          await this._emailService.postClient(b).then(async (data) => {
            await this._emailService.sendEmail(b).then(async (data) => {
              //console.log(JSON.stringify(data))
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Número(s) apartado(s)',
                showConfirmButton: false,
                timer: 1500
              })
            }).catch(err => {
              error = true;
              console.log('Promise send email rejected with: ' + JSON.stringify(err))
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ocurrió un error :(',
                footer: 'Contáctanos para solucionarlo'
              })

            })
          }).catch(err => {
            error = true;
            console.log('Promise add client rejected with: ' + JSON.stringify(err));
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Ocurrió un error :(',
              footer: 'Contáctanos para solucionarlo',
              confirmButtonColor: '#008000',
              confirmButtonText: 'Aceptar'
            })
          })

        }
      })
    })
    if (!error) {
      this.boletosAOcupar.length > 1 ? window.open("https://wa.me/5216441597742/?text=" + this.messageToSendPlural) : window.open("https://wa.me/5216441597742/?text=" + this.messageToSend);
      this.boletosAOcupar = [];
    }
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
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: `Boleto #${boletoSelec} seleccionado`,
        showConfirmButton: false,
        timer: 1500
      })
      this.boletos[parseInt(boletoSelec)].celular = '00';
      this.boletosAOcupar.push(boletoSelec)

    }
    //console.log(this.boletosAOcupar);
  }
  removeBoleto(boletoSelec: string) {
    this.boletos[parseInt(boletoSelec)].celular = '';
    this.boletosAOcupar = this.boletosAOcupar.filter(b => b != boletoSelec)
  }
  async ngOnInit() {
    //this.boletos[0].id="001"
    for (let i: number = 0; i < 1000; i++) {
      let numeroBoleto: string = "";
      if (i < 10) {
        numeroBoleto += "00" + i;
        //console.log('object');
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
        if (c.id == b.id) {
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
