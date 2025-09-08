import { useState, useMemo } from 'react';
import { Calendar, Trash2, Info, CalendarDays, CheckCircle, X, Plus, Settings } from 'lucide-react';

const VacationPlanner2026 = () => {
  // Праздничные дни 2026 года в России
  const holidays: { [key: string]: string } = {
    '2026-01-01': 'Новогодние каникулы',
    '2026-01-02': 'Новогодние каникулы',
    '2026-01-03': 'Новогодние каникулы',
    '2026-01-04': 'Новогодние каникулы',
    '2026-01-05': 'Новогодние каникулы',
    '2026-01-06': 'Новогодние каникулы',
    '2026-01-07': 'Рождество Христово',
    '2026-01-08': 'Новогодние каникулы',
    '2026-01-09': 'Перенесенный выходной',
    '2026-02-23': 'День защитника Отечества',
    '2026-03-08': 'Международный женский день',
    '2026-03-09': 'Перенесенный выходной',
    '2026-05-01': 'Праздник Весны и Труда',
    '2026-05-09': 'День Победы',
    '2026-05-11': 'Перенесенный выходной',
    '2026-06-12': 'День России',
    '2026-11-04': 'День народного единства',
    '2026-12-31': 'Перенесенный выходной'
  };

  // Сокращенные рабочие дни
  const shortDays = ['2026-04-30', '2026-05-08', '2026-06-11', '2026-11-03'];

  interface VacationPeriod {
    id: number;
    startDate: string;
    endDate: string;
    vacationDays: number;
    workingDays: number;
    calendarDays: number;
    color: string;
  }

  const [vacationPeriods, setVacationPeriods] = useState<VacationPeriod[]>([]);
  const [selectionStart, setSelectionStart] = useState<string | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<string | null>(null);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [totalVacationDaysAvailable, setTotalVacationDaysAvailable] = useState(28);
  const [editingDays, setEditingDays] = useState(false);

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const monthNamesShort = [
    'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
    'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
  ];

  const getDaysInMonth = (month: number) => {
    return new Date(2026, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number) => {
    return new Date(2026, month, 1).getDay();
  };

  const isWeekend = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    return day === 0 || day === 6;
  };

  // const formatDate = (date: Date) => {
  //   const d = new Date(date);
  //   return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
  // };

  const formatDateShort = (date: Date) => {
    const d = new Date(date);
    return `${d.getDate()} ${monthNamesShort[d.getMonth()]}`;
  };

  // Подсчет дней отпуска (все дни кроме праздничных)
  const calculateVacationDays = (startDate: string, endDate: string) => {
    let count = 0;
    let current = new Date(startDate);
    const end = new Date(endDate);
    
    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0];
      if (!holidays[dateStr]) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    
    return count;
  };

  // Подсчет рабочих дней (для информации)
  const calculateWorkingDays = (startDate: string, endDate: string) => {
    let count = 0;
    let current = new Date(startDate);
    const end = new Date(endDate);
    
    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0];
      if (!isWeekend(current) && !holidays[dateStr]) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    
    return count;
  };

  const calculateCalendarDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };

  const handleDateClick = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    
    if (!selectionStart || (selectionStart && selectionEnd)) {
      // Начинаем новый выбор
      setSelectionStart(dateStr);
      setSelectionEnd(null);
    } else {
      // Завершаем выбор
      if (new Date(dateStr) < new Date(selectionStart)) {
        setSelectionEnd(selectionStart);
        setSelectionStart(dateStr);
      } else {
        setSelectionEnd(dateStr);
      }
    }
  };

  const handleDateHover = (date: Date) => {
    if (selectionStart && !selectionEnd) {
      setHoveredDate(date.toISOString().split('T')[0]);
    }
  };

  const addVacationPeriod = () => {
    if (selectionStart && selectionEnd) {
      const vacationDays = calculateVacationDays(selectionStart, selectionEnd);
      const workingDays = calculateWorkingDays(selectionStart, selectionEnd);
      const calendarDays = calculateCalendarDays(selectionStart, selectionEnd);
      
      const period: VacationPeriod = {
        id: Date.now(),
        startDate: selectionStart,
        endDate: selectionEnd,
        vacationDays,
        workingDays,
        calendarDays,
        color: `hsl(${Math.random() * 60 + 100}, 70%, 50%)` // Random green-blue color
      };
      
      setVacationPeriods([...vacationPeriods, period]);
      setSelectionStart(null);
      setSelectionEnd(null);
      setHoveredDate(null);
    }
  };

  const cancelSelection = () => {
    setSelectionStart(null);
    setSelectionEnd(null);
    setHoveredDate(null);
  };

  const removePeriod = (id: number) => {
    setVacationPeriods(vacationPeriods.filter(p => p.id !== id));
  };

  const totalVacationDaysUsed = useMemo(() => {
    return vacationPeriods.reduce((sum, period) => sum + period.vacationDays, 0);
  }, [vacationPeriods]);

  const isDateInPeriod = (dateStr: string) => {
    return vacationPeriods.find(period => {
      const date = new Date(dateStr);
      const start = new Date(period.startDate);
      const end = new Date(period.endDate);
      return date >= start && date <= end;
    });
  };

  const isDateInSelection = (dateStr: string) => {
    if (!selectionStart) return false;
    
    const date = new Date(dateStr);
    const start = new Date(selectionStart);
    const end = selectionEnd ? new Date(selectionEnd) : (hoveredDate ? new Date(hoveredDate) : null);
    
    if (!end) return dateStr === selectionStart;
    
    const minDate = start < end ? start : end;
    const maxDate = start > end ? start : end;
    
    return date >= minDate && date <= maxDate;
  };

  const currentSelectionInfo = useMemo(() => {
    if (!selectionStart) return null;
    
    const endDate = selectionEnd || hoveredDate;
    if (!endDate) return null;
    
    const actualStart = new Date(selectionStart) < new Date(endDate) ? selectionStart : endDate;
    const actualEnd = new Date(selectionStart) > new Date(endDate) ? selectionStart : endDate;
    
    return {
      vacationDays: calculateVacationDays(actualStart, actualEnd),
      workingDays: calculateWorkingDays(actualStart, actualEnd),
      calendarDays: calculateCalendarDays(actualStart, actualEnd),
      start: actualStart,
      end: actualEnd
    };
  }, [selectionStart, selectionEnd, hoveredDate]);

  const renderMonth = (month: number) => {
    const daysInMonth = getDaysInMonth(month);
    const firstDay = getFirstDayOfMonth(month);
    const days = [];
    
    // Дни недели
    const weekDays = (
      <div className="grid grid-cols-7 gap-0 mb-1">
        {['П', 'В', 'С', 'Ч', 'П', 'С', 'В'].map((day, i) => (
          <div key={i} className="text-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
    );
    
    // Пустые ячейки в начале месяца
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
      days.push(<div key={`empty-${i}`} className="h-6"></div>);
    }
    
    // Дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(2026, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const isHoliday = holidays[dateStr];
      const isShort = shortDays.includes(dateStr);
      const weekend = isWeekend(date);
      const periodInfo = isDateInPeriod(dateStr);
      const inSelection = isDateInSelection(dateStr);
      const isStartOrEnd = dateStr === selectionStart || dateStr === selectionEnd;
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(date)}
          onMouseEnter={() => handleDateHover(date)}
          className={`
            h-6 text-xs font-medium transition-all relative rounded cursor-pointer
            ${isHoliday ? 'bg-red-100 text-red-600 font-bold' : 
              weekend ? 'bg-gray-100 text-gray-400' : 
              'hover:bg-blue-50 text-gray-700'}
            ${periodInfo && !inSelection ? `text-white` : ''}
            ${inSelection ? 'bg-blue-200 text-blue-900' : ''}
            ${isStartOrEnd ? 'ring-2 ring-blue-500' : ''}
            ${isShort ? 'underline decoration-orange-400' : ''}
          `}
          style={periodInfo && !inSelection ? { backgroundColor: periodInfo.color } : {}}
          title={`${day} ${monthNames[month]}${isHoliday ? ` - ${isHoliday}` : ''}${isShort ? ' (сокращенный день)' : ''}`}
        >
          {day}
        </button>
      );
    }
    
    return (
      <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-2 text-center">
          {monthNames[month]}
        </h3>
        {weekDays}
        <div className="grid grid-cols-7 gap-0">
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-gray-50 min-h-screen">
      {/* Заголовок */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <Calendar className="text-blue-600" />
          Планировщик отпусков 2026
        </h1>
        <p className="text-gray-600">Производственный календарь России • Кликните на календаре для выбора периода</p>
      </div>

      {/* Попап с информацией о выборе */}
      {currentSelectionInfo && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-xl shadow-2xl p-6 border-2 border-blue-500">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Выбран период</h3>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Даты:</strong> {formatDateShort(new Date(currentSelectionInfo.start))} — {formatDateShort(new Date(currentSelectionInfo.end))}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong className="text-blue-600">Дней отпуска:</strong> {currentSelectionInfo.vacationDays}
              </p>
              <p className="text-xs text-gray-500 mb-1">
                Календарных дней: {currentSelectionInfo.calendarDays}
              </p>
              <p className="text-xs text-gray-500">
                Рабочих дней: {currentSelectionInfo.workingDays}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {selectionEnd && (
                <button
                  onClick={addVacationPeriod}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  Добавить период
                </button>
              )}
              <button
                onClick={cancelSelection}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
              >
                <X size={16} />
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-6">
        {/* Левая панель - Календарь на весь год */}
        <div className="flex-1">
          <div className="bg-gray-100 rounded-xl p-4">
            <div className="grid grid-cols-4 gap-3">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(month => (
                <div key={month}>
                  {renderMonth(month)}
                </div>
              ))}
            </div>
            
            {/* Легенда */}
            <div className="mt-4 flex flex-wrap gap-4 justify-center text-xs bg-white rounded-lg p-3">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-100 rounded"></div>
                <span>Праздники (не тратят отпуск)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-100 rounded"></div>
                <span>Выходные</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-white border-b-2 border-orange-400"></div>
                <span>Сокращенные дни</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-200 rounded"></div>
                <span>Выбор</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Отпуск</span>
              </div>
            </div>
          </div>
        </div>

        {/* Правая панель - Список периодов и статистика */}
        <div className="w-96">
          {/* Список периодов */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CalendarDays className="text-green-600" size={20} />
              Периоды отпуска
            </h3>
            
            {vacationPeriods.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm mb-2">Периоды не добавлены</p>
                <p className="text-xs text-gray-400">Выберите даты на календаре</p>
              </div>
            ) : (
              <div className="space-y-3">
                {vacationPeriods.map((period, index) => (
                  <div 
                    key={period.id} 
                    className="p-3 rounded-lg border-2 transition-all hover:shadow-md"
                    style={{ borderColor: period.color, backgroundColor: `${period.color}15` }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div 
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: period.color }}
                          ></div>
                          <p className="text-sm font-semibold">Период {index + 1}</p>
                        </div>
                        <p className="text-sm text-gray-700">
                          {formatDateShort(new Date(period.startDate))} — {formatDateShort(new Date(period.endDate))}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          <span className="font-semibold">{period.vacationDays} дн. отпуска</span> | {period.calendarDays} календ. дн.
                        </p>
                      </div>
                      <button
                        onClick={() => removePeriod(period.id)}
                        className="p-1 hover:bg-red-100 rounded transition-colors"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Статистика */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Info className="text-blue-600" size={20} />
              Статистика
            </h3>
            
            <div className="space-y-3">
              {/* Настройка количества дней */}
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Всего дней отпуска:</span>
                  {editingDays ? (
                    <input
                      type="number"
                      value={totalVacationDaysAvailable}
                      onChange={(e) => setTotalVacationDaysAvailable(parseInt(e.target.value) || 28)}
                      onBlur={() => setEditingDays(false)}
                      onKeyPress={(e) => e.key === 'Enter' && setEditingDays(false)}
                      className="w-16 px-2 py-1 text-lg font-bold text-gray-800 border rounded"
                      autoFocus
                    />
                  ) : (
                    <button
                      onClick={() => setEditingDays(true)}
                      className="flex items-center gap-1 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                    >
                      <span className="text-lg font-bold text-gray-800">{totalVacationDaysAvailable}</span>
                      <Settings size={14} className="text-gray-500" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Использовано дней:</span>
                <span className="text-lg font-bold text-gray-800">{totalVacationDaysUsed}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Осталось дней:</span>
                <span className="text-lg font-bold text-gray-800">{Math.max(0, totalVacationDaysAvailable - totalVacationDaysUsed)}</span>
              </div>
              
              <div className="relative pt-2">
                <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-200">
                  <div
                    style={{ width: `${Math.min(100, (totalVacationDaysUsed / totalVacationDaysAvailable) * 100)}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
                      totalVacationDaysUsed > totalVacationDaysAvailable ? 'bg-orange-500' : 'bg-blue-500'
                    }`}
                  />
                </div>
              </div>
              
              {totalVacationDaysUsed === totalVacationDaysAvailable && (
                <div className="p-3 bg-green-100 rounded-lg flex items-center gap-2">
                  <CheckCircle className="text-green-600" size={16} />
                  <span className="text-sm text-green-700">Отпуск полностью распланирован!</span>
                </div>
              )}
              
              {totalVacationDaysUsed > totalVacationDaysAvailable && (
                <div className="p-3 bg-orange-100 rounded-lg">
                  <span className="text-sm text-orange-700">
                    ⚠️ Превышен отпуск на {totalVacationDaysUsed - totalVacationDaysAvailable} дн.
                  </span>
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500 space-y-1">
              <p>• Праздничные дни не тратят отпуск</p>
              <p>• Выходные дни тратят отпуск</p>
              <p>• В 2026 году: 247 рабочих дней</p>
              <p>• Праздников: 18 дней</p>
            </div>
          </div>

          {/* Инструкция */}
          <div className="bg-blue-50 rounded-xl p-4 mt-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Как использовать:</h4>
            <ol className="text-xs text-blue-800 space-y-1">
              <li>1. Кликните на дату начала отпуска</li>
              <li>2. Кликните на дату окончания</li>
              <li>3. Проверьте количество дней отпуска</li>
              <li>4. Нажмите "Добавить период"</li>
            </ol>
            <p className="text-xs text-blue-600 mt-2 font-medium">
              💡 Совет: планируйте отпуск около праздников для максимального отдыха!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VacationPlanner2026;