import { Component, OnInit } from '@angular/core';
import { Moment } from 'src/app/Moment';
import { MomentService } from 'src/app/services/moment.service';
import { MessagesService } from 'src/app/services/messages.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-moments',
  templateUrl: './new-moments.component.html',
  styleUrls: ['./new-moments.component.css']
})
export class NewMomentsComponent implements OnInit {
  btnText: string = 'Compartilhar!';

  constructor(private momentService: MomentService, private messagesService: MessagesService, private router: Router) { }

  ngOnInit(): void {
  }
  async createHandler(moment: Moment){
    const formData = new FormData();
    formData.append("title", moment.title);
    formData.append("description", moment.description);
    if(moment.image){
      formData.append("image", moment.image);
    }


    await this.momentService.createMoment(formData).subscribe();


    this.messagesService.add("Momento adicionado com sucesso!");

    this.router.navigate(['/'])
  }

}
