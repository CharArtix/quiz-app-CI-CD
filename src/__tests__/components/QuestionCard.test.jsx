import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuestionCard from '../../components/QuestionCard';

// Mock data yang akan dikirim lewat props
const mockData = {
  question: 'Siapa penemu gaya gravitasi?',
  options: ['Isaac Newton', 'Albert Einstein', 'Galileo Galilei', 'Nikola Tesla'],
};

describe('QuestionCard Component', () => {
  const mockOnAnswer = jest.fn();

  beforeEach(() => {
    mockOnAnswer.mockClear();
  });

  it('harus merender pertanyaan dengan benar', () => {
    render(
      <QuestionCard
        data={mockData}
        onAnswer={mockOnAnswer}
        totalQuestions={10}
        currentIndex={0}
      />
    );

    // Assert: Teks pertanyaan harus ada di layar
    expect(screen.getByText('Siapa penemu gaya gravitasi?')).toBeInTheDocument();
  });

  it('harus merender semua opsi jawaban yang disediakan', () => {
    render(
      <QuestionCard
        data={mockData}
        onAnswer={mockOnAnswer}
        totalQuestions={10}
        currentIndex={0}
      />
    );

    // Assert: Semua opsi jawaban dirender
    mockData.options.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it('harus menampilkan nomor pertanyaan yang aktif saat ini', () => {
    render(
      <QuestionCard
        data={mockData}
        onAnswer={mockOnAnswer}
        totalQuestions={10}
        currentIndex={2} // indeks ke-2 artinya pertanyaan ke-3
      />
    );

    // Assert: Menampilkan indikator progress kuis
    expect(screen.getByText('Pertanyaan 3 dari 10')).toBeInTheDocument();
  });

  it('harus memanggil fungsi onAnswer dengan argumen yang benar saat opsi jawaban diklik', async () => {
    render(
      <QuestionCard
        data={mockData}
        onAnswer={mockOnAnswer}
        totalQuestions={10}
        currentIndex={0}
      />
    );

    // Act: Simulasikan klik pada opsi pertama ('Isaac Newton')
    const optionButton = screen.getByText('Isaac Newton');
    await userEvent.click(optionButton);

    // Assert: Fungsi onAnswer dipanggil 1 kali dengan membawa argumen 'Isaac Newton'
    expect(mockOnAnswer).toHaveBeenCalledTimes(1);
    expect(mockOnAnswer).toHaveBeenCalledWith('Isaac Newton');
  });
});
