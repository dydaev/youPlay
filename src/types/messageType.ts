type messageType = {
  type: 'MESSAGE' | 'WARNING' | 'ERROR';
  text: string;
  id?: number;
};

export { messageType };
