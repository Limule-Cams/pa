import {Component, inject, OnInit, WritableSignal} from '@angular/core';
import {NavbareComponent} from '../shared/navbare/navbare.component';
import {FormsModule} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {CreatePubDialogComponent} from '../../../shared/dialog/create-pub-dialog/create-pub-dialog.component';
import {EmployeeService} from '../employee.service';
import {filter, switchMap, tap} from 'rxjs';
import {DatePipe, JsonPipe, NgForOf, NgIf, SlicePipe} from '@angular/common';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [
    NavbareComponent,
    FormsModule,
    NgForOf,
    NgIf,
    SlicePipe,
    DatePipe,
    JsonPipe
  ],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit {
  private readonly employeeService = inject(EmployeeService);

  readonly postsList: WritableSignal<any[]> = this.employeeService.commmunityPostsList;
  readonly chatMessages = this.employeeService.messagesList;
  commentInput: { [key: string]: string } = {}; // Initialize as an object

  showAllComments: { [postId: string]: boolean } = {};

  private employeeId!: number;

  newChatMessage = '';
  currentUser: any;

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.employeeService.getEmployeeDetails$().subscribe((employees) => {
      this.employeeId = employees['userId'];
      this.currentUser = employees;
    });
    this.employeeService.getCommunityPosts().subscribe();
    this.employeeService.getAllMessages().subscribe();
  }

  openPostModal(): void {
    const dialogRef = this.dialog.open(CreatePubDialogComponent, {
      width: '600px',
      maxWidth: '95vw',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().pipe(
      filter(result => result),
      switchMap(result => this.employeeService.submitPost$({employeeId: this.employeeId, content: result}))
    ).subscribe()
  }

  onCommentPost(postId: number): void {
    if (this.commentInput[postId]) {
      this.employeeService.submitComment({
        postId: postId,
        author: this.employeeId,
        content: this.commentInput[postId] // Use the specific postId's comment
      }).pipe(
        switchMap(() => this.employeeService.getCommunityPosts()),
      ).subscribe(() => {
        this.commentInput[postId] = '';
      });
    }
  }

  toggleShowAllComments(postId: string) {
    this.showAllComments[postId] = !this.showAllComments[postId];
  }

  getCommentInput(postId: any): string {
    return this.commentInput[postId] || '';
  }

  setCommentInput(postId: any, value: string): void {
    this.commentInput[postId] = value;
  }

  sendChatMessage() {
    if (this.newChatMessage.trim()) {
      this.employeeService.sendMessage({
        content: this.newChatMessage,
        userId: this.employeeId,
      }).pipe(
        switchMap(() => this.employeeService.getAllMessages()),
        tap(() => this.newChatMessage = ''),
      ).subscribe();
    }
  }

  isCurrentUser(message: any): boolean {
    return message.sender.user.id === this.employeeId
  }

  getInitials(name: string, lastName: string): string {
    return `${name.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
}
