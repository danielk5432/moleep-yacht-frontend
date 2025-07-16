'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { playSound } from '../utils/playSound';

const GameSettingsPage: React.FC = () => {
  const router = useRouter();

  const optionalCategories = [
    "Ones", "Twos", "Threes",
    "Fours", "Fives", "Sixes",
    "Four of a Kind", "Full House", "Little Straight", "Big Straight",
  ];
  const requiredCategories = ["Choice", "Yacht"];
  const [selected, setSelected] = useState<string[]>([...optionalCategories]);

  const isSelected = (cat: string) => selected.includes(cat);

  const toggleSelect = (cat: string) => {
    if (!isSelected(cat)) {
      setSelected(prev => [...prev, cat]);
    }
  };

  const unselect = (cat: string) => {
    setSelected(prev => prev.filter(c => c !== cat));
  };

  const handleStart = () => {
    const selectedSet = new Set(selected); // 선택된 것
    const unselected = optionalCategories.filter(cat => !selectedSet.has(cat));
    const allSelected = [...requiredCategories, ...selected];

    localStorage.setItem('gameCategories', JSON.stringify(allSelected));
    localStorage.setItem('unselectedCategories', JSON.stringify(unselected)); // ✅ 추가
    router.push('/dice');
  };

  const firstRow = optionalCategories.slice(0, 3);
  const secondRow = optionalCategories.slice(3, 6);
  const thirdRow = optionalCategories.slice(6,8);
  const fourthRow = optionalCategories.slice(8);

  const renderRow = (row: string[]) => (
    <div className="flex gap-4 justify-center">
      {row.map(cat => {
        const selectedState = isSelected(cat);
        return (
          <div
            key={cat}
            onClick={() => toggleSelect(cat)}
            
            className={`relative w-36 h-14 flex items-center justify-center rounded-xl border text-sm font-semibold cursor-pointer select-none transition-all
              ${selectedState
                ? 'border-blue-500 bg-blue-50 text-blue-600'
                : 'border-gray-300 bg-gray-100 text-gray-400 hover:border-gray-400'
              }`}
          >
            {cat}
            {selectedState && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  unselect(cat); // ✅ 상태만 회색으로 바꿈!
                }}
                className="absolute top-1 right-2 text-gray-400 hover:text-gray-700 text-sm"
              >
                x
              </button>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50" style={{ fontFamily: 'DungGeunMo' }}>
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-4 text-center">게임 라운드 설정</h2>
        <p className="text-gray-600 text-sm mb-6 text-center">※ <strong>Yacht</strong>, <strong>Choice</strong>는 필수 항목입니다.</p>

        <div className="space-y-4 mb-8">
          {renderRow(firstRow)}
          {renderRow(secondRow)}
          {renderRow(thirdRow)}
          {renderRow(fourthRow)}
        </div>

        {/* 필수 항목 */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {requiredCategories.map(cat => (
            <div
              key={cat}
              className="px-6 py-3 rounded-xl border border-blue-500 bg-blue-50 text-blue-600 text-sm font-medium"
            >
              {cat}(Fixed)
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            playSound('/sounds/click_button.wav');
            handleStart();
          }}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          게임 시작
        </button>
      </div>
    </div>
  );
};

export default GameSettingsPage;
