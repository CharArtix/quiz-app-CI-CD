import React from 'react';
import { render, act } from '@testing-library/react';
import useDocumentTitle from '../../hooks/useDocumentTitle';

// Komponen dummy yang menggunakan hook
function TitleSetter({ title }) {
  useDocumentTitle(title);
  return <div />;
}

describe('useDocumentTitle Hook', () => {
  const originalTitle = document.title;

  afterEach(() => {
    document.title = originalTitle;
  });

  it('harus mengubah document.title sesuai prop yang diberikan', () => {
    render(<TitleSetter title="Halaman Quiz | DOT Quiz" />);
    expect(document.title).toBe('Halaman Quiz | DOT Quiz');
  });

  it('harus memperbarui title ketika prop berubah', () => {
    const { rerender } = render(<TitleSetter title="Soal 1" />);
    expect(document.title).toBe('Soal 1');

    rerender(<TitleSetter title="Soal 2" />);
    expect(document.title).toBe('Soal 2');
  });

  it('harus mengembalikan title semula saat komponen unmount', () => {
    document.title = 'Judul Awal';
    const { unmount } = render(<TitleSetter title="Judul Sementara" />);
    expect(document.title).toBe('Judul Sementara');

    unmount();
    expect(document.title).toBe('Judul Awal');
  });
});
