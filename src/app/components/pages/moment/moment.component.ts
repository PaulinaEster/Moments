import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
} from '@angular/forms'; 

import { ActivatedRoute } from '@angular/router';

import { Moment } from 'src/app/Moment';
import { Comment } from 'src/app/Comment';

import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

import { faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';
import { MomentService } from 'src/app/services/moment.service';
import { MessagesService } from 'src/app/services/messages.service';
import { ComentService } from 'src/app/services/coment.service';

@Component({
  selector: 'app-moment',
  templateUrl: './moment.component.html',
  styleUrls: ['./moment.component.css']
})
export class MomentComponent implements OnInit {
  moment!: Moment;
  baseApiUrl = environment.baseApiUrl;

  faTimes = faTimes;
  faEdit = faEdit;

  commentForm!: FormGroup;

  constructor(private momentService: MomentService,  private route: ActivatedRoute,
    private messagesService: MessagesService,
    private router: Router,
    private commentService: ComentService) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"));

    this.momentService.getMoment(id).subscribe((item)=>{
      this.moment = item.data;
    });

    this.commentForm = new FormGroup({
      text: new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(120)]),
      username: new FormControl("", [Validators.required, Validators.minLength(5)]),
    })
  }

  get text(){
    return this.commentForm.get('text');
  }

  get username(){
    return this.commentForm.get('username');
  }

  async removeHandler(id: number){
    if(id){
      await this.momentService.removeMoment(id).subscribe();

      this.messagesService.add('Momento excluido com sucesso!');
      this.router.navigate(['/']);
    }
  }

  async onSubmit(formDirective: FormGroupDirective){
    if(this.commentForm.invalid){
      return;
    }
    const data: Comment = this.commentForm.value;

    data.momentId = Number(this.moment!.id);

    await this.commentService.createComment(data).subscribe(comment => this.moment!.comments!.push(comment.data));

    this.messagesService.add(`Comentário adicionado!`);

    this.commentForm.reset();

    formDirective.resetForm();

  }

}
