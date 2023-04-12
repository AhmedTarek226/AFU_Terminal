import { Injectable } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  showSuccess(title: string, content: string) {
    this.messageService.add({
      severity: 'success',
      summary: title,
      detail: content,
    });
  }

  showInfo(title: string, content: string) {
    this.messageService.add({
      severity: 'info',
      summary: title,
      detail: content,
    });
  }

  showWarn(title: string, content: string) {
    this.messageService.add({
      severity: 'warn',
      summary: title,
      detail: content,
    });
  }

  showError(title: string, content: string) {
    this.messageService.add({
      severity: 'error',
      summary: title,
      detail: content,
    });
  }

  clear() {
    this.messageService.clear();
  }
}
