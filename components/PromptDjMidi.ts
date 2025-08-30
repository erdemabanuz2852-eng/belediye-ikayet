/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { Complaint, Status, Department, Action } from '../types';

const MOCK_DEPARTMENTS: Department[] = [
    { id: 'zabita', name: 'Zabıta', email: 'zabita@belediye.gov.tr' },
    { id: 'temizlik', name: 'Temizlik İşleri', email: 'temizlik@belediye.gov.tr' },
    { id: 'park_bahce', name: 'Park ve Bahçeler', email: 'parkbahceler@belediye.gov.tr' },
    { id: 'fen_isleri', name: 'Fen İşleri', email: 'fenisleri@belediye.gov.tr' },
];

const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: 'S001',
    title: 'Kaldırımda Çöp Konteyneri Dolmuş',
    description: 'Ana caddedeki çöp konteyneri tamamen dolmuş ve etrafına taşmış durumda. Acil temizlik gerekiyor.',
    departmentId: 'temizlik',
    status: Status.New,
    location: 'Atatürk Cd. No: 15',
    createdAt: '2024-07-28T10:30:00Z',
    history: [
      { timestamp: '2024-07-28T10:30:00Z', description: 'Şikayet oluşturuldu.', actor: 'Vatandaş' }
    ]
  },
  {
    id: 'S002',
    title: 'Parktaki Salıncak Kırık',
    description: 'Çocuk parkındaki salıncaklardan birinin zinciri kopmuş, tehlike arz ediyor.',
    departmentId: 'park_bahce',
    status: Status.InProgress,
    location: 'Çocuk Parkı, Demokrasi Meydanı',
    createdAt: '2024-07-27T15:00:00Z',
    history: [
      { timestamp: '2024-07-27T15:00:00Z', description: 'Şikayet oluşturuldu.', actor: 'Vatandaş' },
      { timestamp: '2024-07-27T16:00:00Z', description: 'Ekibe atandı.', actor: 'Park ve Bahçeler Md.', assignedTo: 'Bakım Ekibi A' }
    ]
  },
  {
    id: 'S003',
    title: 'Yolda Büyük Çukur Var',
    description: 'Okulun önündeki yolda arabaların lastiğine zarar verecek büyüklükte bir çukur oluşmuş.',
    departmentId: 'fen_isleri',
    status: Status.Completed,
    location: 'Eğitim Sk. No: 8',
    createdAt: '2024-07-26T09:00:00Z',
    history: [
      { timestamp: '2024-07-26T09:00:00Z', description: 'Şikayet oluşturuldu.', actor: 'Vatandaş' },
      { timestamp: '2024-07-26T11:00:00Z', description: 'Asfalt ekibi yönlendirildi.', actor: 'Fen İşleri Amiri', assignedTo: 'Asfalt Ekibi' },
      { timestamp: '2024-07-26T14:30:00Z', description: 'Çukur onarıldı, sorun giderildi.', actor: 'Ekip Lideri' }
    ]
  },
  {
    id: 'S004',
    title: 'Seyyar Satıcı',
    description: 'Hastane önünde yüksek sesle satış yapan seyyar satıcı var.',
    departmentId: 'zabita',
    status: Status.InProgress,
    location: 'Devlet Hastanesi Acil Girişi',
    createdAt: '2024-07-28T11:00:00Z',
    history: [
      { timestamp: '2024-07-28T11:00:00Z', description: 'Şikayet oluşturuldu.', actor: 'Vatandaş' },
      { timestamp: '2024-07-28T11:05:00Z', description: 'Zabıta ekibi yönlendirildi.', actor: 'Zabıta Amiri', assignedTo: 'Devriye Ekibi 3' },
    ]
  },
];

@customElement('complaint-app')
export class ComplaintApp extends LitElement {
  static override styles = css`
    :host {
      display: block;
      height: 100%;
      background-color: var(--background-color);
    }

    .app-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }

    header h1 {
      margin: 0;
      font-size: 2.5rem;
      color: var(--primary-color);
    }
    
    header .header-actions {
      display: flex;
      gap: 12px;
    }

    .add-button, .manage-button {
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: var(--border-radius);
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.3s, box-shadow 0.3s;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: var(--box-shadow);
    }

    .add-button {
      background-color: var(--secondary-color);
    }

    .add-button:hover {
      background-color: #2980b9;
      box-shadow: 0 6px 10px rgba(0,0,0,0.15);
    }
    
    .manage-button {
        background-color: var(--primary-color);
    }
    
    .manage-button:hover {
        background-color: #34495e;
        box-shadow: 0 6px 10px rgba(0,0,0,0.15);
    }

    .complaint-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }

    .complaint-card {
      background-color: var(--surface-color);
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      padding: 16px;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      border-left: 5px solid var(--light-gray-color);
    }
    
    .complaint-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 12px rgba(0,0,0,0.15);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }

    .card-header h3 {
      margin: 0;
      font-size: 1.2rem;
      color: var(--primary-color);
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 700;
      color: white;
      white-space: nowrap;
    }
    
    .status-Yeni { border-color: var(--status-new); background-color: var(--status-new); }
    .status-İşleme\\.Alındı { border-color: var(--status-inprogress); background-color: var(--status-inprogress); }
    .status-Tamamlandı { border-color: var(--status-completed); background-color: var(--status-completed); }

    .card-body p {
      margin: 0 0 12px 0;
      color: var(--text-color);
      font-size: 0.9rem;
    }

    .card-footer {
      font-size: 0.8rem;
      color: var(--light-gray-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-footer-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s, visibility 0.3s;
      z-index: 1000;
    }

    .modal-overlay.open {
      opacity: 1;
      visibility: visible;
    }

    .modal-content {
      background: var(--surface-color);
      padding: 32px;
      border-radius: var(--border-radius);
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      transform: scale(0.9);
      transition: transform 0.3s;
    }
    
    .modal-overlay.open .modal-content {
      transform: scale(1);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      border-bottom: 1px solid var(--light-gray-color);
      padding-bottom: 16px;
    }
    
    .modal-header h2 {
      margin: 0;
      color: var(--primary-color);
    }

    .close-button {
      background: none;
      border: none;
      font-size: 1.8rem;
      cursor: pointer;
      color: var(--light-gray-color);
      line-height: 1;
    }

    .form-grid {
      display: grid;
      gap: 16px;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      margin-bottom: 8px;
      font-weight: 500;
    }

    .form-group input, .form-group textarea, .form-group select {
      padding: 12px;
      border: 1px solid var(--light-gray-color);
      border-radius: 4px;
      font-size: 1rem;
      font-family: inherit;
      width: 100%;
    }
    
    .form-group input:disabled {
      background-color: #e9ecef;
      color: #495057;
      cursor: not-allowed;
    }

    .form-group p {
        padding: 12px;
        background-color: #f8f9fa;
        border-radius: 4px;
        border: 1px solid var(--light-gray-color);
        margin: 0;
    }

    .form-group textarea {
      min-height: 100px;
      resize: vertical;
    }

    .form-group input[type="file"] {
        padding: 8px;
    }
    .form-group input[type="file"]::file-selector-button {
        background-color: var(--primary-color);
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 12px;
        transition: background-color 0.2s;
    }
    .form-group input[type="file"]::file-selector-button:hover {
        background-color: #3e5771;
    }

    .complaint-image {
      max-width: 100%;
      border-radius: var(--border-radius);
      margin-top: 8px;
      border: 1px solid var(--light-gray-color);
    }
    
    .history-list {
        list-style-type: none;
        padding: 0;
        margin-top: 8px;
        border-left: 2px solid var(--secondary-color);
    }
    .history-list li {
        padding: 8px 16px;
        margin-bottom: 8px;
        position: relative;
    }
    .history-list li::before {
        content: '';
        position: absolute;
        left: -9px;
        top: 12px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: var(--secondary-color);
        border: 2px solid var(--surface-color);
    }
    .history-list li small {
        color: var(--text-color);
        font-style: italic;
        display: block;
        margin-top: 4px;
    }

    .form-actions {
      margin-top: 24px;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    
    .submit-button, .cancel-button {
      border: none;
      padding: 12px 24px;
      border-radius: var(--border-radius);
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
    }

    .submit-button {
      background-color: var(--secondary-color);
      color: white;
    }
    
    .department-management ul {
        list-style: none;
        padding: 0;
    }
    
    .department-management li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 8px;
        border-bottom: 1px solid var(--light-gray-color);
        gap: 16px;
    }

    .department-management li small {
        color: var(--light-gray-color);
        font-size: 0.85rem;
        margin-left: auto;
    }
    
    .department-management form {
        margin-top: 24px;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
  `;

  @state() private departments: Department[] = MOCK_DEPARTMENTS;
  @state() private complaints: Complaint[] = MOCK_COMPLAINTS;
  @state() private selectedComplaint: Complaint | null = null;
  @state() private isComplaintModalOpen = false;
  @state() private isDepartmentModalOpen = false;
  @state() private isNewComplaint = false;

  private openComplaintModal(complaint: Complaint | null) {
    if (complaint) {
        this.selectedComplaint = complaint;
        this.isNewComplaint = false;
    } else {
        this.selectedComplaint = null; // New complaint
        this.isNewComplaint = true;
    }
    this.isComplaintModalOpen = true;
  }

  private closeModal() {
    this.isComplaintModalOpen = false;
    this.isDepartmentModalOpen = false;
    this.selectedComplaint = null;
  }
  
  private openDepartmentModal() { this.isDepartmentModalOpen = true; }

  private handleAddClick() {
    this.openComplaintModal(null);
  }

  private handleCardClick(complaint: Complaint) {
    this.openComplaintModal(complaint);
  }
  
  private fileToBase64 = (file: File): Promise<string> => 
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });

  private async handleFormSubmit(e: SubmitEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    let imageUrl: string | undefined = undefined;
    const imageFile = formData.get('image') as File;

    if (imageFile && imageFile.size > 0) {
        try {
            imageUrl = await this.fileToBase64(imageFile);
        } catch (error) {
            console.error("Error reading file:", error);
            this.dispatchEvent(new CustomEvent('show-toast', { detail: `Görsel okunurken hata oluştu.`, bubbles: true, composed: true }));
        }
    }
    
    const newComplaintData: Complaint = {
        id: `S${Date.now().toString().slice(-4)}`,
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        location: formData.get('location') as string,
        departmentId: formData.get('departmentId') as string,
        status: Status.New,
        createdAt: new Date().toISOString(),
        history: [{
            timestamp: new Date().toISOString(),
            description: 'Şikayet oluşturuldu.',
            actor: 'Admin'
        }],
        imageUrl: imageUrl,
    };
    this.complaints = [newComplaintData, ...this.complaints];
    
    const department = this.departments.find(d => d.id === newComplaintData.departmentId);
    let toastMessage = `Şikayet eklendi. ${department?.name || ''} birimine yönlendirildi.`;

    if (department?.email) {
        const subject = `Yeni Şikayet Bildirimi: #${newComplaintData.id}`;
        const body = `
Sayın ${department.name} Yetkilisi,

Sisteme yeni bir şikayet kaydı oluşturulmuştur. Detaylar aşağıdadır:

- Şikayet ID: ${newComplaintData.id}
- Başlık: ${newComplaintData.title}
- Konum: ${newComplaintData.location}
- Açıklama: ${newComplaintData.description}

Gereğini arz ederiz.
Belediye Şikayet Yönetim Sistemi`;
        
        console.log("--- E-POSTA BİLDİRİM SİMÜLASYONU ---");
        console.log(`Alıcı: ${department.email}`);
        console.log(`Konu: ${subject}`);
        console.log(`İçerik: ${body.trim()}`);
        console.log("-------------------------------------");

        toastMessage = `${department.name} birimine e-posta bildirimi gönderildi.`;
    }
    
    this.dispatchEvent(new CustomEvent('show-toast', { detail: toastMessage, bubbles: true, composed: true }));
    this.closeModal();
  }

  private handleAddAction(e: SubmitEvent) {
    e.preventDefault();
    if (!this.selectedComplaint) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const description = formData.get('description') as string;
    const assignedTo = formData.get('assignedTo') as string;

    const newAction: Action = {
        timestamp: new Date().toISOString(),
        description,
        actor: 'Yönetici',
        assignedTo: assignedTo || undefined,
    };
    
    const complaintIndex = this.complaints.findIndex(c => c.id === this.selectedComplaint!.id);
    if (complaintIndex > -1) {
        const updatedComplaint = { ...this.complaints[complaintIndex] };
        updatedComplaint.history = [...updatedComplaint.history, newAction];
        
        if (updatedComplaint.status === Status.New) {
            updatedComplaint.status = Status.InProgress;
        }

        const newComplaints = [...this.complaints];
        newComplaints[complaintIndex] = updatedComplaint;
        this.complaints = newComplaints;
        this.selectedComplaint = updatedComplaint;
        
        const department = this.departments.find(d => d.id === updatedComplaint.departmentId);
        let toastMessage = 'Aksiyon eklendi.';

        if (department?.email) {
            const subject = `Şikayet Güncellemesi: #${updatedComplaint.id}`;
            const body = `
Sayın ${department.name} Yetkilisi,

#${updatedComplaint.id} numaralı şikayete yeni bir işlem eklenmiştir:

- Şikayet Başlığı: ${updatedComplaint.title}
- Yeni Aksiyon: ${newAction.description}
- Atanan Kişi/Ekip: ${newAction.assignedTo || 'Belirtilmedi'}
- Güncel Durum: ${updatedComplaint.status}

Belediye Şikayet Yönetim Sistemi`;

            console.log("--- E-POSTA BİLDİRİM SİMÜLASYONU ---");
            console.log(`Alıcı: ${department.email}`);
            console.log(`Konu: ${subject}`);
            console.log(`İçerik: ${body.trim()}`);
            console.log("-------------------------------------");
            
            toastMessage = `Aksiyon eklendi. ${department.name} birimine e-posta gönderildi.`;
        }
        
        this.dispatchEvent(new CustomEvent('show-toast', { detail: toastMessage, bubbles: true, composed: true }));
        form.reset();
    }
  }

  private handleStatusChange(e: Event) {
    if (!this.selectedComplaint) return;

    const newStatus = (e.target as HTMLSelectElement).value as Status;
    const complaintId = this.selectedComplaint.id;
    
    const complaintIndex = this.complaints.findIndex(c => c.id === complaintId);
    if (complaintIndex === -1) return;

    const originalComplaint = this.complaints[complaintIndex];

    if (originalComplaint.status === newStatus) return; // No change

    const updatedComplaint = { ...originalComplaint };
    updatedComplaint.status = newStatus;
    
    const newAction: Action = {
        timestamp: new Date().toISOString(),
        description: `Durum '${originalComplaint.status}' statüsünden '${newStatus}' statüsüne güncellendi.`,
        actor: 'Yönetici',
    };
    updatedComplaint.history = [...updatedComplaint.history, newAction];

    const newComplaints = [...this.complaints];
    newComplaints[complaintIndex] = updatedComplaint;
    this.complaints = newComplaints;
    this.selectedComplaint = updatedComplaint;

    const department = this.departments.find(d => d.id === updatedComplaint.departmentId);
    let toastMessage = `İşlem başarılı: Durum '${newStatus}' olarak güncellendi.`;

    if (department?.email) {
        const subject = `Şikayet Durum Güncellemesi: #${updatedComplaint.id}`;
        const body = `
Sayın ${department.name} Yetkilisi,

#${updatedComplaint.id} numaralı şikayetin durumu güncellenmiştir:

- Şikayet Başlığı: ${updatedComplaint.title}
- Önceki Durum: ${originalComplaint.status}
- Yeni Durum: ${newStatus}

Belediye Şikayet Yönetim Sistemi`;

        console.log("--- E-POSTA BİLDİRİM SİMÜLASYONU ---");
        console.log(`Alıcı: ${department.email}`);
        console.log(`Konu: ${subject}`);
        console.log(`İçerik: ${body.trim()}`);
        console.log("-------------------------------------");
        
        toastMessage = `İşlem başarılı: Durum güncellendi ve ${department.name} birimine e-posta gönderildi.`;
    }
    
    this.dispatchEvent(new CustomEvent('show-toast', { detail: toastMessage, bubbles: true, composed: true }));
}

  private handleAddDepartment(e: SubmitEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const departmentName = (formData.get('departmentName') as string)?.trim();
    const departmentEmail = (formData.get('departmentEmail') as string)?.trim();

    if (departmentName && !this.departments.some(d => d.name.toLowerCase() === departmentName.toLowerCase())) {
        const newDepartment: Department = {
            id: departmentName.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
            name: departmentName,
            email: departmentEmail || undefined,
        };
        this.departments = [...this.departments, newDepartment];
        this.dispatchEvent(new CustomEvent('show-toast', { detail: `'${departmentName}' birimi eklendi.`, bubbles: true, composed: true }));
        form.reset();
    } else {
         this.dispatchEvent(new CustomEvent('show-toast', { detail: `Birim adı boş olamaz veya zaten mevcut.`, bubbles: true, composed: true }));
    }
  }

  private renderComplaintCard(complaint: Complaint) {
    const statusClass = `status-${complaint.status.replace(' ', '\\.')}`;
    const departmentName = this.departments.find(d => d.id === complaint.departmentId)?.name || 'Bilinmeyen Birim';
    return html`
      <div class="complaint-card" @click=${() => this.handleCardClick(complaint)}>
        <div class="card-header">
          <h3>${complaint.title}</h3>
          <span class="status-badge ${statusClass}">${complaint.status}</span>
        </div>
        <div class="card-body">
          <p>${departmentName}</p>
        </div>
        <div class="card-footer">
          <span>#${complaint.id}</span>
          <div class="card-footer-right">
            ${complaint.imageUrl ? html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.49"></path></svg>` : ''}
            <span>${new Date(complaint.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    `;
  }
  
  private renderComplaintModal() {
    const complaint = this.selectedComplaint;
    const title = this.isNewComplaint ? 'Yeni Şikayet Ekle' : `Şikayet Detayı #${complaint?.id}`;

    return html`
    <div class=${classMap({ "modal-overlay": true, "open": this.isComplaintModalOpen })} @click=${this.closeModal}>
        <div class="modal-content" @click=${(e: Event) => e.stopPropagation()}>
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="close-button" @click=${this.closeModal}>&times;</button>
            </div>
            ${this.isNewComplaint ? this.renderComplaintForm() : this.renderComplaintDetails(complaint!)}
        </div>
    </div>
    `;
  }

  private renderComplaintForm() {
    return html`
      <form @submit=${this.handleFormSubmit}>
        <div class="form-grid">
          <div class="form-group">
            <label for="title">Şikayet Başlığı</label>
            <input type="text" id="title" name="title" required>
          </div>
          <div class="form-group">
            <label for="description">Açıklama</label>
            <textarea id="description" name="description" required></textarea>
          </div>
          <div class="form-group">
            <label for="location">Konum / Adres</label>
            <input type="text" id="location" name="location" required>
          </div>
          <div class="form-group">
            <label for="departmentId">İlgili Birim</label>
            <select id="departmentId" name="departmentId" required>
              ${this.departments.map(dep => html`<option value=${dep.id}>${dep.name}</option>`)}
            </select>
          </div>
          <div class="form-group">
            <label for="status">Durum</label>
            <input type="text" id="status" name="status" .value=${Status.New} disabled>
          </div>
          <div class="form-group">
            <label for="image">Görsel Yükle (İsteğe Bağlı)</label>
            <input type="file" id="image" name="image" accept="image/*">
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="submit-button">Gönder</button>
        </div>
      </form>
    `;
  }

  private renderComplaintDetails(complaint: Complaint) {
    const departmentName = this.departments.find(d => d.id === complaint.departmentId)?.name;
    return html`
      <div>
        <div class="form-grid">
            <div class="form-group"><label>Başlık</label><p>${complaint.title}</p></div>
            <div class="form-group"><label>Açıklama</label><p>${complaint.description}</p></div>
            <div class="form-group"><label>Konum</label><p>${complaint.location}</p></div>
            <div class="form-group"><label>Birim</label><p>${departmentName}</p></div>
            <div class="form-group">
                <label for="complaint-status">Durum</label>
                <select id="complaint-status" .value=${complaint.status} @change=${this.handleStatusChange}>
                    ${Object.values(Status).map(s => html`<option value=${s}>${s}</option>`)}
                </select>
            </div>
            ${complaint.imageUrl ? html`
              <div class="form-group">
                  <label>Eklenen Görsel</label>
                  <img class="complaint-image" src=${complaint.imageUrl} alt="Şikayet Görseli">
              </div>
            ` : ''}
        </div>
        
        <div class="form-group" style="margin-top: 24px;">
            <label>Geçmiş</label>
            <ul class="history-list">
                ${complaint.history.map(h => html`<li>
                    <strong>${new Date(h.timestamp).toLocaleString()}:</strong> ${h.description} (${h.actor})
                    ${h.assignedTo ? html`<small>Atanan: ${h.assignedTo}</small>` : ''}
                </li>`)}
            </ul>
        </div>

        <div class="action-form" style="margin-top: 24px;">
            <h3 style="color: var(--primary-color); border-top: 1px solid var(--light-gray-color); padding-top: 16px;">Yeni Aksiyon Ekle</h3>
            <form @submit=${this.handleAddAction}>
                <div class="form-group">
                    <label for="action-description">Aksiyon Açıklaması</label>
                    <textarea id="action-description" name="description" required></textarea>
                </div>
                <div class="form-group">
                    <label for="action-assignedTo">Atanan Personel/Ekip</label>
                    <input type="text" id="action-assignedTo" name="assignedTo">
                </div>
                <div class="form-actions">
                    <button type="submit" class="submit-button">Aksiyon Ekle</button>
                </div>
            </form>
        </div>
      </div>
    `;
  }

  private renderDepartmentModal() {
    return html`
    <div class=${classMap({ "modal-overlay": true, "open": this.isDepartmentModalOpen })} @click=${this.closeModal}>
      <div class="modal-content" @click=${(e: Event) => e.stopPropagation()}>
        <div class="modal-header">
            <h2>Birimleri Yönet</h2>
            <button class="close-button" @click=${this.closeModal}>&times;</button>
        </div>
        <div class="department-management">
          <h4>Mevcut Birimler</h4>
          <ul>
            ${this.departments.map(dep => html`
                <li>
                    <span>${dep.name}</span>
                    <small>${dep.email || 'E-posta atanmamış'}</small>
                </li>
            `)}
          </ul>
          <form @submit=${this.handleAddDepartment}>
            <h4 style="margin-bottom: 0;">Yeni Birim Ekle</h4>
            <div class="form-grid" style="grid-template-columns: 1fr 1fr; align-items: end;">
                <div class="form-group">
                    <label for="departmentName">Birim Adı</label>
                    <input type="text" id="departmentName" name="departmentName" placeholder="Örn: Park ve Bahçeler" required>
                </div>
                <div class="form-group">
                    <label for="departmentEmail">Birim E-postası</label>
                    <input type="email" id="departmentEmail" name="departmentEmail" placeholder="bildirim@belediye.gov.tr">
                </div>
            </div>
            <div class="form-actions">
                <button type="submit" class="submit-button">Ekle</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    `;
  }


  override render() {
    return html`
      <div class="app-container">
        <header>
          <h1>Admin Paneli: Şikayet Yönetimi</h1>
          <div class="header-actions">
            <button class="manage-button" @click=${this.openDepartmentModal}>Birimleri Yönet</button>
            <button class="add-button" @click=${this.handleAddClick}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Yeni Şikayet
            </button>
          </div>
        </header>
        <main>
          <div class="complaint-list">
            ${this.complaints.map(c => this.renderComplaintCard(c))}
          </div>
        </main>
      </div>
      ${this.isComplaintModalOpen ? this.renderComplaintModal() : ''}
      ${this.isDepartmentModalOpen ? this.renderDepartmentModal() : ''}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'complaint-app': ComplaintApp;
  }
}