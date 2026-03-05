import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const datetimePicker = document.querySelector("#datetime-picker");

const startBtn = document.querySelector("[data-start]");

startBtn.disabled = true;

function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

let userSelectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const pickedDate = selectedDates[0];

    if (pickedDate <= new Date()) {
      userSelectedDate = null;
      startBtn.disabled = true;

      iziToast.warning({
        title: "Warning",
        message: "Please choose a date in the future",
      });
    } else {
      userSelectedDate = pickedDate;
      startBtn.disabled = false;
    }
  },
};

flatpickr(datetimePicker, options);

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");

function updateTimer({ days, hours, minutes, seconds }) {
  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

let intervalId;

startBtn.addEventListener("click", () => {
 
  startBtn.disabled = true;
  datetimePicker.disabled = true;

  intervalId = setInterval(() => {
    const currentTime = Date.now();
    const diff = userSelectedDate - currentTime;

    if (diff <= 0) {
      clearInterval(intervalId);

      updateTimer({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });

      datetimePicker.disabled = false;
      return;
    }

    const time = convertMs(diff);
    updateTimer(time);
  }, 1000);
});