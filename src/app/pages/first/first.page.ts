import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-first',
  templateUrl: './first.page.html',
  styleUrls: ['./first.page.scss'],
})
export class FirstPage implements OnInit {
  //option to the slider
  slideOpts = {
    speed: 1000
  };
  slides=[
    {
      img:'assets/img/slide1.svg',
      title:"Conectate<br> cuando quieras",
      subtitle:"Basta que te conectes solo <br> <b>cuando quieras</b> trabajar"
    },
    {
      img:'assets/img/slide2.svg',
      title:"Gestionamos <br> tus clientes",
      subtitle:"Tu solo preocupate por <b>conectarte</b>,<br> nosotros <b>hacemos</b> el resto."
    },
    {
      img:'assets/img/slide3.svg',
      title:"Gana dinero",
      subtitle:"Basta de pagar <b>altas comisiones</b>,<br> ahora tu manejas tus <b>ganancias</b>"
    }
  ]
  constructor(
              private router : Router
              ) { }

  ngOnInit() {
  }

  navigateTo(page : string){
    console.log(page);
    this.router.navigate([`/${page}`]);
  }
  

}
