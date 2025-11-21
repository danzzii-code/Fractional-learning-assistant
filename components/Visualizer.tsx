import React from 'react';
import { MathProblem } from '../types';
import { Citrus, Apple, Star, Cherry } from 'lucide-react';

interface VisualizerProps {
  problem: MathProblem;
  activeSegments?: number; // For interactive mode
  onSegmentClick?: (index: number) => void; // For interactive mode
  isPartitioned?: boolean; // For length mode: true if grid lines are shown. For discrete: true if grouped.
  onRulerClick?: (value: number) => void; // For length mode: handler for partitioning
}

export const Visualizer: React.FC<VisualizerProps> = ({ 
  problem, 
  activeSegments = 0, 
  onSegmentClick,
  isPartitioned = true, // Default to true for backward compatibility/other modes
  onRulerClick
}) => {
  
  // Helper to render fraction vertically
  const renderVerticalFraction = (numerator: number | string, denominator: number | string) => (
    <div className="inline-flex flex-col items-center align-middle mx-1" style={{ verticalAlign: 'middle' }}>
      <span className="font-bold text-black border-b-2 border-black px-1 leading-none mb-0.5 text-sm md:text-base">{numerator}</span>
      <span className="font-bold text-black leading-none text-sm md:text-base">{denominator}</span>
    </div>
  );

  // --- RENDER MODE: LENGTH (Number Line) ---
  if (problem.subType === 'length') {
    const segments = Array.from({ length: problem.totalGroups }, (_, i) => i);
    
    // It is interactive if a handler is provided. 
    // If interactive, we use the tracked activeSegments state.
    // If not interactive (e.g. readonly or complete), we show the target groups (the "answer" visual).
    const isInteractive = !!onSegmentClick;
    const segmentsToHighlight = isInteractive ? activeSegments : problem.targetGroups;
    
    return (
      <div className="w-full py-8 px-4">
        {/* Title / Explanation specific to length */}
        <div className="mb-6 flex items-center justify-center text-center text-gray-600 font-medium flex-wrap">
          <span>{problem.totalItems}cm의</span>
          {renderVerticalFraction(problem.targetGroups, problem.totalGroups)}
          <span>은(는) 얼마인지 알아보기</span>
        </div>

        {/* Wrapper with padding for the unit label */}
        <div className="relative pt-6 pb-2 pr-12">
          
          {/* Number Line */}
          <div className="relative h-8 w-full border-b-2 border-black mb-1">
            {Array.from({ length: problem.totalItems + 1 }).map((_, i) => (
              <div 
                key={i} 
                className="absolute bottom-0 flex flex-col items-center" 
                style={{ left: `${(i / problem.totalItems) * 100}%`, transform: 'translateX(-50%)' }}
              >
                {/* Tick Mark */}
                <div className="h-3 w-0.5 bg-black"></div>
                {/* Number Label */}
                {/* If not partitioned, numbers are interactive buttons to guess the unit size */}
                { !isPartitioned && onRulerClick && i > 0 ? (
                  <button
                    onClick={() => onRulerClick(i)}
                    className="absolute top-full mt-2 text-sm md:text-base font-bold whitespace-nowrap hover:text-pink-500 hover:scale-125 transition-all cursor-pointer animate-pulse"
                  >
                    {i}
                  </button>
                ) : (
                  <span className="absolute top-full mt-2 text-sm md:text-base font-bold whitespace-nowrap text-black">
                    {i}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Unit Label - Positioned in the padding area, aligned with numbers */}
          <div className="absolute right-0 top-[2.6rem] text-sm md:text-base font-bold text-gray-600">
            (cm)
          </div>

          {/* Bar Model */}
          {/* mt-8 provides space for the numbers above */}
          <div className="flex w-full h-12 mt-8 border-2 border-gray-300 rounded-lg overflow-hidden bg-white select-none relative">
            
            {/* If NOT partitioned yet, show empty bar with hint */}
            {!isPartitioned ? (
               <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400 text-xs md:text-sm animate-pulse">
                 👆 눈금 숫자를 눌러서 {problem.totalGroups}묶음으로 나눠보세요!
               </div>
            ) : (
              /* Partitioned Grid */
              segments.map((index) => {
                const isActive = index < segmentsToHighlight;
                return (
                  <div 
                    key={index}
                    onClick={() => isInteractive && onSegmentClick && onSegmentClick(index)}
                    className={`
                      flex-1 border-r border-gray-200 last:border-r-0 transition-all duration-300 relative
                      ${isActive ? 'bg-sky-300/80' : 'bg-white'}
                      ${isInteractive ? 'cursor-pointer hover:bg-sky-100' : ''}
                    `}
                  >
                    {isActive && (
                       <div className="w-full h-full border-r-2 border-sky-400 last:border-none"></div>
                    )}
                  </div>
                );
              })
            )}
          </div>
          
          {/* Helper Text below bar */}
          {isInteractive && (
             <div className="text-center mt-3 text-xs text-gray-400 min-h-[1.5rem]">
                {!isPartitioned 
                  ? `전체 ${problem.totalItems}을 똑같이 ${problem.totalGroups}로 나누면 한 묶음은 얼마일까요?`
                  : `👆 칸을 클릭해서 ${problem.targetGroups}칸을 색칠해보세요!`
                }
             </div>
          )}
        </div>
      </div>
    );
  }

  // --- RENDER MODE: DISCRETE ITEMS ---
  const renderIcon = (size: number) => {
    const props = { size, className: "text-secondary fill-orange-200 drop-shadow-sm" };
    switch (problem.itemType) {
      case 'apple': return <Apple {...props} className="text-red-500 fill-red-200" />;
      case 'strawberry': return <Cherry {...props} className="text-pink-600 fill-pink-300" />;
      case 'star': return <Star {...props} className="text-yellow-400 fill-yellow-100" />;
      case 'orange':
      default: return <Citrus {...props} />;
    }
  };

  const groups = Array.from({ length: problem.totalGroups }, (_, i) => i);

  return (
    <div className="flex flex-col items-center">
      {problem.lessonType === 'value_finding' && (
        <div className="mb-4 flex items-center justify-center text-center text-gray-600 font-medium flex-wrap">
          <span>{problem.totalItems}의</span>
          {renderVerticalFraction(problem.targetGroups, problem.totalGroups)}
          <span>는 얼마인지 알아보기</span>
        </div>
      )}
      
      <div className="flex flex-wrap justify-center gap-4 md:gap-8 py-4">
        {!isPartitioned ? (
          // Ungrouped View (Step 1)
          <div className="flex flex-wrap justify-center gap-3 max-w-md p-4 bg-white/40 rounded-2xl border-2 border-dashed border-gray-300">
            {Array.from({ length: problem.totalItems }).map((_, i) => (
              <div key={i} className="animate-bounce-slow">
                {renderIcon(40)}
              </div>
            ))}
             <div className="w-full text-center text-gray-500 text-xs md:text-sm mt-2 font-medium">
                전체 {problem.totalItems}개
             </div>
          </div>
        ) : (
          // Grouped View (Step 2)
          groups.map((groupIndex) => {
            // In 'value_finding', we visually highlight the 'target' groups to help them count.
            // In 'representation', we usually show them equally, but highlighting the target helps understanding too.
            const isTargetGroup = groupIndex < problem.targetGroups;

            return (
              <div 
                key={groupIndex} 
                className={`
                  relative flex gap-1 p-3 rounded-xl border-4 transition-all duration-500 animate-in zoom-in
                  ${isTargetGroup 
                    ? 'bg-white border-primary shadow-md scale-105 z-10' 
                    : 'bg-white/60 border-gray-200 opacity-80'
                  }
                `}
              >
                {Array.from({ length: problem.groupSize }).map((_, itemIndex) => (
                  <div key={itemIndex} className="animate-bounce-slow">
                    {renderIcon(40)}
                  </div>
                ))}
                
                {/* Group Number Badge */}
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-500 font-bold border border-gray-200">
                  {groupIndex + 1}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};