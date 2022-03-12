export enum Status {
  'NONE' = 'NONE',
  'PAYING' = 'PAYING',
  'SENDING' = 'SENDING',
  'ORDER_PLACED' = 'ORDER_PLACED',
  'ORDER_STARTED' = 'ORDER_STARTED',
  'ORDER_READY' = 'ORDER_READY',
  'ORDER_COMPLETE' = 'ORDER_COMPLETE',
  'ORDER_ERROR' = 'ORDER_ERROR',
  'ORDER_CANCELLATION_STARTED' = 'ORDER_CANCELLATION_STARTED',
  'ORDER_CANCELLATION_COMPLETE' = 'ORDER_CANCELLATION_COMPLETE',
}

export enum PageState {
  HOME = 'home',
  SETTINGS = 'settings',
  CHOOSE_STORE = 'choose-store',
  MAKE_ORDER = 'make-order',
}

export interface CurrentOrderDetails {
  amount: number
  customerName: string
  products: string
  orderId: string
  storeId: string
  time: number
}

export interface OrderEvent {
  time: number
  event: Status
  orderId: string
}
