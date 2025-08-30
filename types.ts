/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export enum Status {
  New = 'Yeni',
  InProgress = 'İşleme Alındı',
  Completed = 'Tamamlandı',
}

export interface Department {
  id: string;
  name: string;
  email?: string;
}

export interface Action {
  timestamp: string;
  description: string;
  actor: string;
  assignedTo?: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  departmentId: string;
  status: Status;
  location: string;
  createdAt: string;
  history: Action[];
  imageUrl?: string;
}

// Fix: Add missing type definitions to resolve compilation errors.
export type PlaybackState = 'playing' | 'paused' | 'stopped' | 'loading';

export interface Prompt {
  promptId: string;
  text: string;
  weight: number;
  cc: number;
  color: string;
}

export interface ControlChange {
  cc: number;
  value: number;
  channel: number;
}