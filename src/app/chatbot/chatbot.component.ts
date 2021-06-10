import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  
    this.addBotMessage('Bonjour User !!​😁​🤩​ Je suis votre assistante virtuelle Sage ,Comment puis-je vous aider ');
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

    this.loading = true;

    // Make the request 
    this.http.post<any>(
      dialogflowURL,
      {text})
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
