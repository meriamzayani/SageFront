import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorageService } from '../_services/token-storage.service';

const dialogflowURL = 'http://localhost:8080/send-msg';
@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
//   styles: [`
//   ::ng-deep nb-layout-column {
//     justify-content: center;
//     display: flex;
//   }
//   nb-chat {
//     width: 500px;
//   }
// `]
styleUrls:['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  messages = [];
  files=[];
  loading = false;
  
  // Random ID to maintain session with server
  sessionId = Math.random().toString(36).slice(-5);
  constructor(private http: HttpClient,private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    
    console.log(this.tokenStorage.getUser());
    const user = this.tokenStorage.getUser();
    this.addBotMessage(`Bonjour ${user.username} !!​😁​🤩​ Je suis votre assistante virtuelle Sage ,Comment puis-je vous aider`);
  }

  handleUserMessage(event) {
    const text = event.message;
    const files = !event.files ? [] : event.files.map((file) => {
      console.log(file);
      return {
        url: file.src,
        type: file.type,
        icon: 'file-text-outline',
      };
    });
   
   
    //console.log(files)
   

    this.addUserMessage(text,files);
    const headers = new HttpHeaders().set('x-access-token', `${this.tokenStorage.getToken()}`);

    this.loading = true;
   
    // Make the request 
    const userId =this.tokenStorage.getUser().id;
    
    this.http.post<any>(
      dialogflowURL,
      {text}, { headers })
    .subscribe(res => {
      const { Reply } = res;
      this.addBotMessage(Reply);
      console.log("the fulfilment is"+Reply)
      this.loading = false;
    });
  }

  addUserMessage(text,files) {
    this.messages.push({
      text:text,
      sender: 'User',
      reply: true,
      date: new Date(),
      type: files.length ? 'file' : 'text',
      files: files,  
      });
  }

  addBotMessage(text) {
    console.log(this.files)
    this.messages.push({
      text:text,
      sender: 'Sage',
      avatar: '/assets/sage.gif',
      date: new Date(),
      type: this.files.length ? 'file' : 'text',
      //files: this.files, 
      
    });
  }


}
