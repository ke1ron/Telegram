import logging
import os
import time
from telegram import Update
from telegram.ext import Updater, CommandHandler, CallbackContext
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

# Вставьте свой токен
TELEGRAM_BOT_TOKEN = '8105277577:AAHtuZnwOm1MmvRG_OjeV2N63OHDQSFWua0'

# Настройка логирования
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s', level=logging.INFO)
logger = logging.getLogger(__name__)

# Настройка веб-драйвера (безголовый режим)
options = webdriver.ChromeOptions()
options.add_argument('--headless')  # Безголовый режим
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

# Функция для создания аккаунта
def create_account(username, password, email):
    driver.get("URL_TO_REGISTER_PAGE")  # Замените на URL страницы регистрации
    time.sleep(2)

    driver.find_element(By.NAME, "username").send_keys(username)
    driver.find_element(By.NAME, "password").send_keys(password)
    driver.find_element(By.NAME, "email").send_keys(email)
    driver.find_element(By.NAME, "submit").click()
    time.sleep(5)  # Подождите, пока загрузится страница после регистрации

# Функция для лайка поста
def like_post(video_url, count):
    driver.get(video_url)  # Перейти на видео
    time.sleep(2)  # Подождите, пока видео загрузится

    for _ in range(count):
        like_button = driver.find_element(By.XPATH, "//button[contains(@class, 'like-button')]")  # Замените на правильный XPATH
        like_button.click()
        time.sleep(1)  # Подождите между лайками

# Функция для подписки
def follow_user(user_id, count):
    user_url = f"https://www.clapper.com/{user_id}"  # Замените на правильный URL пользователя
    driver.get(user_url)
    time.sleep(2)  # Подождите, пока страница пользователя загрузится

    for _ in range(count):
        follow_button = driver.find_element(By.XPATH, "//button[contains(@class, 'follow-button')]")  # Замените на правильный XPATH
        follow_button.click()
        time.sleep(1)  # Подождите между подписками

# Функция для просмотра видео
def view_video(video_url, count):
    driver.get(video_url)  # Перейти на видео
    time.sleep(2)  # Подождите, пока видео загрузится

    for _ in range(count):
        play_button = driver.find_element(By.XPATH, "//button[contains(@class, 'play-button')]")  # Замените на правильный XPATH
        play_button.click()
        time.sleep(10)  # Смотрим видео 10 секунд
        driver.refresh()  # Перезагружаем страницу для нового просмотра
        time.sleep(2)  # Подождите перед следующим просмотром

# Команда для создания аккаунта
def register(update: Update, context: CallbackContext) -> None:
    if len(context.args) < 3:
        update.message.reply_text('Используйте: /register <username> <password> <email>')
        return

    username = context.args[0]
    password = context.args[1]
    email = context.args[2]

    create_account(username, password, email)
    update.message.reply_text(f'Аккаунт {username} успешно создан.')

# Команда для лайка
def like(update: Update, context: CallbackContext) -> None:
    if len(context.args) < 2:
        update.message.reply_text('Используйте: /like <video_url> <количество>')
        return

    video_url = context.args[0]
    try:
        count = int(context.args[1])
    except ValueError:
        update.message.reply_text('Количество должно быть числом.')
        return

    like_post(video_url, count)
    update.message.reply_text(f'Успешно поставлено {count} лайков на {video_url}.')

# Команда для подписки
def follow(update: Update, context: CallbackContext) -> None:
    if len(context.args) < 2:
        update.message.reply_text('Используйте: /follow <user_id> <количество>')
        return

    user_id = context.args[0]
    try:
        count = int(context.args[1])
    except ValueError:
        update.message.reply_text('Количество должно быть числом.')
        return

    follow_user(user_id, count)
    update.message.reply_text(f'Успешно подписались на {count} аккаунтов {user_id}.')

# Команда для просмотра видео
def view(update: Update, context: CallbackContext) -> None:
    if len(context.args) < 2:
        update.message.reply_text('Используйте: /view <video_url> <количество>')
        return

    video_url = context.args[0]
    try:
        count = int(context.args[1])
    except ValueError:
        update.message.reply_text('Количество должно быть числом.')
        return

    view_video(video_url, count)
    update.message.reply_text(f'Успешно просмотрено {count} раз видео {video_url}.')

def main() -> None:
    # Создание Updater и Dispatcher
    updater = Updater(TELEGRAM_BOT_TOKEN)
    dispatcher = updater.dispatcher

    # Обработка команд
    dispatcher.add_handler(CommandHandler("register", register))
    dispatcher.add_handler(CommandHandler("like", like))
    dispatcher.add_handler(CommandHandler("follow", follow))
    dispatcher.add_handler(CommandHandler("view", view))

    # Запуск бота
    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    # Введите данные для входа перед запуском
    login('YOUR_USERNAME', 'YOUR_PASSWORD')  # Укажите свои данные
    main()
