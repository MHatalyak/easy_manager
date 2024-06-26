# EasyManager

## Опис

EasyManager – це інтегроване рішення для організації даних компанії, що дозволяє ефективно управляти проектами, клієнтами, навчальними матеріалами, календарем та особистими профілями співробітників. Цей додаток призначений для підвищення продуктивності, спрощення управління даними та поліпшення комунікації всередині компанії.

## Особливості

- **Організаційне дерево**: Візуалізуйте структуру вашої компанії, відділи та підрозділи.
- **Проєкти**: Створюйте та керуйте проєктами, відстежуйте прогрес і ставте завдання.
- **Клієнти**: Зберігайте інформацію про клієнтів, відстежуйте взаємодії та угоди.
- **Навчальні матеріали**: Додавайте та організовуйте навчальні ресурси для співробітників.
- **Календар**: Плануйте події та зустрічі, синхронізуйте їх з іншими сервісами.
- **Особистий профіль**: Кожен співробітник має свій профіль з персональним планом розвитку, подібний до Trello-дошки.
- **Налаштування**: Можливість зміни теми та мови інтерфейсу для зручності користувачів.

## Потенційні користувачі

Цей додаток розроблено для широкого кола користувачів:

- **Керівництво компанії**: для отримання загального огляду структури та діяльності компанії.
- **Проектні менеджери**: для ефективного управління проектами та координації роботи команди.
- **HR-відділ**: для зберігання та організації інформації про співробітників і клієнтів.
- **Співробітники**: для доступу до навчальних матеріалів, планування подій і управління власним розвитком.
- **Відділ підтримки клієнтів**: для зберігання та відстеження взаємодій з клієнтами.

## Інсталяція

1. Склонуйте репозиторій:
    ```sh
    git clone https://github.com/yourusername/yourrepository.git
    cd yourrepository
    ```

2. Встановіть залежності:
    ```sh
    npm install
    ```

3. Налаштуйте файл `.env` з наступними змінними:
    ```sh
    DB_USER=your_database_user
    DB_HOST=your_database_host
    DB_DATABASE=your_database_name
    DB_PASSWORD=your_database_password
    DB_PORT=your_database_port
    DB_ENCODING=UTF8
    ```

4. Запустіть додаток:
    ```sh
    npm start
    ```

## Використання

1. Відкрийте браузер і перейдіть за адресою `http://localhost:3000`.
2. Використовуйте інтерфейс для навігації між різними сторінками додатка.
3. Налаштуйте тему та мову в розділі "Налаштування".

## Внесок

Якщо ви бажаєте внести свій вклад у проект, будь ласка, дотримуйтесь наступних кроків:

1. Форкніть репозиторій.
2. Створіть нову гілку (`git checkout -b feature-branch`).
3. Внесіть зміни та зафіксуйте їх (`git commit -m 'Add some feature'`).
4. Запуште гілку (`git push origin feature-branch`).
5. Відкрийте Pull Request.

