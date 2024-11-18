export type Role = 'assistant' | 'user';

export interface Message {
	role: Role;
	content: string;
}

export interface ChatProps {
	messages?: Message[];
	onSubmit?: (message: string) => void;
}

export interface PromptInputProps {
	onSubmit?: (message: string) => void;
}

export interface SendButtonProps {
	disabled?: boolean;
} 