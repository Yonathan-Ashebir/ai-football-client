import {useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {MAXIMUM_UPCOMING_MATCH_DAYS} from "../types/matches.ts";

interface DateRangeSelectorProps {
  minDate?: Date;
  maxDate?: Date;
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
}

export function DateRangeSelector({
                                    minDate = new Date(),
                                    maxDate = new Date(new Date().setDate(new Date().getDate() + MAXIMUM_UPCOMING_MATCH_DAYS)),
                                    startDate,
                                    endDate,
                                    onStartDateChange,
                                    onEndDateChange,
                                  }: DateRangeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [activeSelector, setActiveSelector] = useState<'start' | 'end'>('start');

  console.log(startDate, endDate);
  useEffect(() => {
    if (startDate) {
      setCurrentMonth(startDate);
    }
  }, [startDate]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days: Date[] = [];

    // Add previous month's days
    for (let i = 0; i < firstDayOfMonth; i++) {
      const prevDate = new Date(year, month, -i);
      days.unshift(prevDate);
    }

    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    // Add next month's days to complete the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days = 42
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  };

  const isDateInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  };

  const isDateInHoverRange = (date: Date) => {
    if (!hoverDate || !startDate || endDate) return false;
    return date >= startDate && date <= hoverDate;
  };

  const handleDateClick = (date: Date) => {
    if (activeSelector === 'start') {
      if (endDate && date > endDate) {
        onEndDateChange(null);
      }
      onStartDateChange(date);
      setActiveSelector('end');
    } else {
      if (date < startDate!) {
        onStartDateChange(date);
        onEndDateChange(startDate);
      } else {
        onEndDateChange(date);
      }
      setActiveSelector('start');
    }
  };

  const isDateDisabled = (date: Date) => {
    return date < minDate || date > maxDate;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Select date';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const nextMonth = () => {
    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0) < maxDate && setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  };

  const prevMonth = () => {
    new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1) > minDate && setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  };

  return (
    <div className="relative">
      <div
        className="inline-flex items-center gap-4 bg-white p-2 rounded-lg shadow-md cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
       {/* <Calendar className="w-5 h-5 text-purple-600" />*/}
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-md ${activeSelector === 'start' ? 'bg-purple-100' : ''}`}>
            {formatDate(startDate)}
          </div>
          <span className="text-gray-400">→</span>
          <div className={`px-3 py-1 rounded-md ${activeSelector === 'end' ? 'bg-purple-100' : ''}`}>
            {formatDate(endDate)}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-2 bg-white rounded-lg shadow-xl p-4 z-50"
          >
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={prevMonth}
                className={`p-1 rounded-full transition-colors ${new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1) <= minDate? 'opacity-20': 'hover:bg-purple-100'}`}
                disabled={new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1) <= minDate}
              >
                <ChevronLeft className="w-5 h-5 text-purple-600" />
              </button>
              <h3 className="text-lg font-semibold text-gray-800">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <button
                onClick={nextMonth}
                className={`p-1 rounded-full transition-colors ${new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0) >= maxDate? 'opacity-20': 'hover:bg-purple-100'}`}
                disabled={new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0) >= maxDate}
              >
                <ChevronRight className="w-5 h-5 text-purple-600" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
                  {day}
                </div>
              ))}

              {getDaysInMonth(currentMonth).map((date, index) => {
                const isDisabled = isDateDisabled(date);
                const isSelected = startDate?.toDateString() === date.toDateString() ||
                  endDate?.toDateString() === date.toDateString();
                const isInRange = isDateInRange(date);
                const isInHoverRange = isDateInHoverRange(date);
                const isCurrentMonth = date.getMonth() === currentMonth.getMonth();

                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: !isDisabled ? 1.1 : 1 }}
                    whileTap={{ scale: !isDisabled ? 0.95 : 1 }}
                    onClick={() => !isDisabled && handleDateClick(date)}
                    onMouseEnter={() => !isDisabled && setHoverDate(date)}
                    onMouseLeave={() => setHoverDate(null)}
                    disabled={isDisabled}
                    className={`
                      relative h-10 rounded-lg text-sm font-medium transition-colors px-2
                      ${isDisabled ? 'text-red-300 cursor-not-allowed' : 'hover:text-purple-600'}
                      ${!isCurrentMonth && !isSelected && !isInRange ? 'text-gray-400' : 'text-gray-700'}
                      ${isSelected ? 'bg-purple-600 text-white' : ''}
                      ${(isInRange || isInHoverRange) && !isSelected ? 'bg-purple-100' : ''}
                    `}
                  >
                    {date.getDate()}
                    {(isInRange || isInHoverRange) && !isSelected && (
                      <motion.div
                        layoutId="range-highlight"
                        className="absolute inset-0 bg-purple-100 rounded-lg -z-10"
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/*<div className="mt-4 flex justify-between text-sm text-gray-500">
              <div>Min: {minDate.toLocaleDateString()}</div>
              <div>Max: {maxDate.toLocaleDateString()}</div>
            </div>*/}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}