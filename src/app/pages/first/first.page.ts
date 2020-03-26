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
      img:'assets/img/1.png',
      title:"Conectate<br> cuando quieras"
    },
    {
      img:'assets/img/2.png',
      title:"Trabaja <br> cuando puedas"
    },
    {
      img:'assets/img/img2.svg',
      title:"Gana cuanto <br> quieras"
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
