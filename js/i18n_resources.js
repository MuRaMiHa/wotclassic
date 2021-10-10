var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");


function translate(key) {
    if (window.TRANSLATIONS && key in TRANSLATIONS) return TRANSLATIONS[key];

    if (window.DEBUG_TRANSLATIONS) {
        alert('can not found javascript translation for key: "' + key + '"');
    }

    return key;
};

var TRANSLATIONS = {
    // common
    'OK': gettext('Ok'),
    'YES': gettext('Да'),
    'NO': gettext('Нет'),

    'OR': gettext('или'),

    'COOKIES_NOT_ENABLED': gettext('Пожалуйста, включите приём cookies в вашем браузере и перезагрузите страницу.'),

    // common/wg_dev.js
    'WG_DEV_DEBUG_INFO': gettext('Отладочная информация'),
    'WG_DEV_CLOSE_BUTTON': gettext('Закрыть'),

    // common/tooltips.js
    'TOOLTIP_DOES_NOT_FOUND': gettext('Подсказка не найдена'),
    'TOOLTIP_LOADING': gettext('Загрузка...'),

    // wgportlsdk/js/wgsdk.forms.js
    'FORMS_UNKNOWN_ERROR': gettext('Неизвестная ошибка, повторите попытку позже.'),
    'FORMS_AUTH_NOT_CONFIRMED': gettext('Вы не подтвердили операцию'),
    'FORMS_TIMEOUT': gettext('Превышено время ожидания, попробуйте ещё раз.'),
    'FORMS_SERVER_UNAVAILABLE': gettext('Сервер временно недоступен, повторите попытку позже'),
    'FORMS_WRONG_SERVER_ANSWER': gettext('Неверный ответ сервера'),

    'FORMS_ERROR_413': gettext('Превышен допустимый размер загружаемых файлов'),
    'FORMS_ERROR_413_WITH_LIMIT': gettext('Превышен допустимый размер загружаемых файлов (максимум: %(size)i)'),

    'FORMS_VALIDATION_MIN_LENGTH_ERROR': gettext('Недопустимая длина'),
    'FORMS_VALIDATION_MAX_LENGTH_ERROR': gettext('Недопустимая длина'),
    'FORMS_VALIDATION_EMPTY_FIELD_ERROR': gettext('Поле должно быть заполнено'),

    // wgportalsdk/js/wgsdk.time.js
    'TIME_SUNDAY': gettext('Воскресенье'),
    'TIME_MONDAY': gettext('Понедельник'),
    'TIME_TUESDAY': gettext('Вторник'),
    'TIME_WEDNESDAY': gettext('Среда'),
    'TIME_THURSDAY': gettext('Четверг'),
    'TIME_FRIDAY': gettext('Пятница'),
    'TIME_SATURDAY': gettext('Суббота'),

    'TIME_SHORT_SUNDAY': gettext('вск'),
    'TIME_SHORT_MONDAY': gettext('пнд'),
    'TIME_SHORT_TUESDAY': gettext('втр'),
    'TIME_SHORT_WEDNESDAY': gettext('срд'),
    'TIME_SHORT_THURSDAY': gettext('чтв'),
    'TIME_SHORT_FRIDAY': gettext('птн'),
    'TIME_SHORT_SATURDAY': gettext('сбт'),

    'TIME_MIN_SUNDAY': gettext('Вс'),
    'TIME_MIN_MONDAY': gettext('Пн'),
    'TIME_MIN_TUESDAY': gettext('Вт'),
    'TIME_MIN_WEDNESDAY': gettext('Ср'),
    'TIME_MIN_THURSDAY': gettext('Чт'),
    'TIME_MIN_FRIDAY': gettext('Пт'),
    'TIME_MIN_SATURDAY': gettext('Сб'),

    'TIME_JANUARY': gettext('Январь'),
    'TIME_FEBRUARY': gettext('Февраль'),
    'TIME_MARCH': gettext('Март'),
    'TIME_APRIL': gettext('Апрель'),
    'TIME_MAY': gettext('Май'),
    'TIME_JUNE': gettext('Июнь'),
    'TIME_JULY': gettext('Июль'),
    'TIME_AUGUST': gettext('Август'),
    'TIME_SEPTEMBER': gettext('Сентябрь'),
    'TIME_OCTOBER': gettext('Октябрь'),
    'TIME_NOVEMBER': gettext('Ноябрь'),
    'TIME_DECEMBER': gettext('Декабрь'),

    'TIME_SHORT_JANUARY': gettext('Янв'),
    'TIME_SHORT_FEBRUARY': gettext('Фев'),
    'TIME_SHORT_MARCH': gettext('Мар'),
    'TIME_SHORT_APRIL': gettext('Апр'),
    'TIME_SHORT_MAY': gettext('Май'),
    'TIME_SHORT_JUNE': gettext('Июн'),
    'TIME_SHORT_JULY': gettext('Июл'),
    'TIME_SHORT_AUGUST': gettext('Авг'),
    'TIME_SHORT_SEPTEMBER': gettext('Сен'),
    'TIME_SHORT_OCTOBER': gettext('Окт'),
    'TIME_SHORT_NOVEMBER': gettext('Ноя'),
    'TIME_SHORT_DECEMBER': gettext('Дек'),

    'TIME_YEAR_REDUCTION': gettext('г.'),

    'TIME_DT_PICKER_CLOSE': gettext('Сохранить'),
    'TIME_DT_PICKER_CANCEL': gettext('Отмена'),
    'TIME_DT_PICKER_PREV': gettext('&#x3c;Пред'),
    'TIME_DT_PICKER_NEXT': gettext('След&#x3e;'),
    'TIME_DT_PICKER_TODAY': gettext('Сегодня'),
    'TIME_DT_PICKER_WEEK_HEADER': gettext('Не'),

    'TIME_DT_PICKER_CHOOSE_TIME': gettext('Выберите время'),
    'TIME_DT_PICKER_TIME': gettext('Время (UTC)'),
    'TIME_DT_PICKER_HOURS': gettext('Часы'),
    'TIME_DT_PICKER_MINUTES': gettext('Минуты'),
    'TIME_DT_PICKER_SECONDS': gettext('Секунды'),
    'TIME_DT_PICKER_CURRENT': gettext('Теперь'),

    // common/wot_hl_common.js
    'HL_COMMON_UNKNOWN_ERROR': gettext('Неизвестная ошибка, повторите попытку позже.'),

    // common/wgsdk.dialog.js
    'DIALOG_CAN_NOT_RECEIVE_DATA': gettext('При получении данных произошла ошибка!'),
    'DIALOG_ERROR': gettext('Ошибка'),
    'DIALOG_CLOSE_BUTTON': gettext('Закрыть'),
    'DIALOG_INFORMATION_BUTTON': gettext('Информация...'),
    'DIALOG_REPEATE_BUTTON': gettext('Повторить'),
    'DIALOG_EMPTY_SERVER_RESPONSE': gettext('Неверный тип данных (пустой ответ сервера).'),
    'DIALOG_WRONG_SERVER_RESPONSE': gettext('Неверный ответ сервера.'),
    'DIALOG_WRONG_DATA_TYPE': gettext('Неверный тип данных.'),

    // tournaments/events.js
    'TOURNAMENTS_COMMANDS': gettext('Команды'),
	'TOURNAMENTS_POINTS_TOOLTIP': gettext('Очки'),
    'TOURNAMENTS_GAME_TOOLTIP': gettext('Количество проведенных боев'),
    'TOURNAMENTS_ASSIGN_TEAM_TO_EVENT_NO_SEED': gettext('Ввести посев'),

    // clans/form_validation.js
    'CLANS_NAME_NOT_SET': gettext('Нет имени'),
    'CLANS_TAG_NOT_SET': gettext('Нет тега'),
    'CLANS_MOTTO_NOT_SET': gettext('Нет девиза'),

    'CLANS_EMPTY_NAME': gettext('Вы не ввели имя клана'),
    'CLANS_SHORT_NAME': gettext('Недопустимая длина'),
    'CLANS_LONG_NAME': gettext('Недопустимая длина'),

    'CLANS_EMPTY_TAG': gettext('Вы не ввели тэг клана'),
    'CLANS_LONG_TAG': gettext('Недопустимая длина'),
    'CLANS_WRONG_TAG_SYMBOLS': gettext('Недопустимые символы'),

    'CLANS_EMPTY_MOTTO': gettext('Вы не ввели девиз клана'),
    'CLANS_LONG_MOTTO': gettext('Недопустимая длина'),

    'CLANS_LONG_DESCRIPTION': gettext('Недопустимая длина'),

	// personal/js/utils.js
	'PWD_STRENGTH_EASY': gettext('Очень простой'),
	'PWD_STRENGTH_NORMAL': gettext('Простой'),
	'PWD_STRENGTH_GOOD': gettext('Нормальный'),
	'PWD_STRENGTH_VERY_GOOD': gettext('Сложный'),

    // personal/js/form_validate.js
    'PERSONAL_PWD_LONG': gettext('Недопустимая длина'),
    'PERSONAL_PWD_WRONG_TAG_SYMBOLS': gettext('Пароль содержит некорректные символы. Используйте латинские буквы, цифры и символ подчёркивания'),

    'PERSONAL_PWD_WRONG': gettext('Пароль неверный'),
    'PERSONAL_PWDS_NOT_MATCH': gettext('Пароли не совпадают'),
    'PERSONAL_PWDS_MATCH': gettext('Старый и новый пароли не должны совпадать'),
	'PERSONAL_LOGIN_PWD_MATCH': gettext('Пароль не должен совпадать с Вашим логином'),
	'PERSONAL_NICK_PWD_MATCH': gettext('Пароль не должен совпадать с Вашим ником'),
    'PERSONAL_PWD_OLD_EMPTY': gettext('Вы не ввели старый пароль'),
    'PERSONAL_NEW_PWD_EMPTY': gettext('Вы не ввели новый пароль'),
    'PERSONAL_NEW_PWD_CONFIRM_EMPTY': gettext('Вы не подтвердили новый пароль'),
    'PERSONAL_PWD_SHORT': gettext('Очень короткий'),
    'PERSONAL_PWD_EASY': gettext('Очень легкий'),
    'PERSONAL_PWD_NORM': gettext('Нормальный'),
    'PERSONAL_PWD_GOOD': gettext('Хороший'),
    'PERSONAL_PWD_VERY_GOOD': gettext('Очень хороший'),

    'PERSONAL_PWDS_FIN_NOT_MATCH': gettext('Пароли не совпадают'),
    'PERSONAL_PWD_FIN_MATCH_ACC_PWD': gettext('Финансовый пароль не должен совпадать с паролем от аккаунта'),
    'PERSONAL_PWD_FIN_EMPTY': gettext('Вы не ввели текущий финансовый пароль'),
    'PERSONAL_NEW_PWD_FIN_EMPTY': gettext('Вы не ввели новый финансовый пароль'),
    'PERSONAL_NEW_PWD_FIN_CONFIRM_EMPTY': gettext('Вы не подтвердили новый финансовый пароль'),
    'PERSONAL_PWDS_FIN_MATCH': gettext('Новый финансовый пароль и старый не должны совпадать'),
	'PERSONAL_LOGIN_PWD_FIN_MATCH': gettext('Финансовый пароль не должен совпадать с Вашим логином'),
	'PERSONAL_NICK_PWD_FIN_MATCH': gettext('Финансовый пароль не должен совпадать с Вашим ником'),

    'PERSONAL_ACC_PWD_EMPTY': gettext('Вы не ввели пароль к аккаунту'),
    'PERSONAL_SQ_ANSWER_EMPTY': gettext('Вы не ввели ответ'),
    'PERSONAL_SQ_OWNQ_EMPTY': gettext('Вы не ввели вопрос'),
	'PERSONAL_SQ_QUESTION_EMPTY': gettext('Вы не выбрали вопрос'),

    'PERSONAL_RA_LOGIN_EMPTY': gettext('Вы не ввели email'),
    'PERSONAL_RA_DATE_EMPTY': gettext('Вы не ввели дату'),
    'PERSONAL_RA_EMAIL_EMPTY': gettext('Вы не ввели контактный email'),
    'PERSONAL_RA_DSCR_EMPTY': gettext('Вы не ввели описание проблемы'),
    'PERSONAL_RA_SQ_EMPTY': gettext('Вы не ввели ответ на секретный вопрос'),
    'PERSONAL_RA_EMAIL_FAIL': gettext('Введите корректный email'),

    // personal/subscription/js/helper.js
    'PERSONAL_SBSCR_SUBSCRIPTION': gettext('Подписка'),
    'PERSONAL_SBSCR_ERROR': gettext('Неизвестная ошибка, повторите попытку позже.'),

    // personal/js/sms_price.js
    'PERSONAL_PAY_ON_NUMBER': gettext('на номер'),
    'PERSONAL_PAY_VAT': gettext('с учётом НДС'),
    'PERSONAL_SMS_FEE': gettext('SMS платные. Стоимость СМС'),

	'PERSONAL_PROMOCODE_EMPTY': gettext('Вы не ввели бонус-код'),
    'CBT_INVITECODE_EMPTY': gettext('Вы не ввели инвайт-код'),

    // personal/js/payment.js
    'PERSONAL_PAYMENT_SYSTEM_ERROR': gettext('Сервис оплаты временно недоступен'),

    // personal/js/gifts-incoming.js
    'GIFTS_GIFT_RECEIVED': gettext('Подарок принят, и будет вам начислен в ближайшее время'),
    'GIFTS_ACCEPT_TITLE': gettext('Принять подарок?'),
    'GIFTS_CANCEL_TITLE': gettext('Отказаться от подарка?'),
    'GIFTS_ACCEPT_QUESTION': gettext('Вы уверены, что хотите принять подарок?'),
    'GIFTS_CANCEL_QUESTION': gettext('Вы уверены, что хотите отказаться от подарка?'),
    'GIFTS_NO_WAY_BACK': gettext('Это действие нельзя отменить.'),

    'REGISTRATION_ACCOUNT_NAME_TOO_SHORT': gettext('Слишком короткое имя пользователя'),
    'REGISTRATION_ACCOUNT_NAME_TOO_LONG': gettext('Слишком длинное имя пользователя'),
    'REGISTRATION_ACCOUNT_NAME_INVALID': gettext('Имя содержит некорректные символы. Можно использовать латинские буквы, цифры и символ подчёркивания'),

    'REGISTRATION_ACCOUNT_LOGIN_TOO_SHORT': gettext('Слишком короткий email'),
    'REGISTRATION_ACCOUNT_LOGIN_TOO_LONG': gettext('Слишком длинный email'),
    'REGISTRATION_ACCOUNT_LOGIN_INVALID': gettext('Требуется валидный email'),

    'REGISTRATION_ACCOUNT_PASSWORD_TOO_SHORT': gettext('Слишком короткий пароль'),
    'REGISTRATION_ACCOUNT_PASSWORD_TOO_LONG': gettext('Слишком длинный пароль'),
    'REGISTRATION_ACCOUNT_PASSWORD_INVALID': gettext('Пароль содержит некорректные символы. Используйте латинские буквы, цифры и символ подчёркивания'),
    'REGISTRATION_ACCOUNT_PASSWORD_SAME_TO_LOGIN_OR_NICKNAME': gettext('Пароль совпадает с именем или email'),

    'REGISTRATION_ACCOUNT_PASSWORD_NOT_CONFIRMED': gettext('Вы не повторили пароль'),
    'REGISTRATION_ACCOUNT_PASSWORDS_DONT_MATCH': gettext('Введенные пароли не совпадают'),

    'REGISTRATION_PASSWORD_COMPLEXITY_SHORT': gettext('Очень короткий'),
    'REGISTRATION_PASSWORD_COMPLEXITY_NORMAL': gettext('Нормальный'),
    'REGISTRATION_PASSWORD_COMPLEXITY_GOOD': gettext('Хороший'),
    'REGISTRATION_PASSWORD_COMPLEXITY_VERYGOOD': gettext('Очень хороший'),

    'TOURNAMENT_EDIT_BATTLE_DIALOG' : gettext('Редактирование сражения'),

    'DATETIME_ONE_MINUTE_AGO' : gettext('Менее минуты назад'),
    'DATETIME_ONE_HOUR_AGO' : gettext('Менее часа назад'),
    'DATETIME_TODAY' : gettext('Сегодня'),
    'DATETIME_YESTERDAY' : gettext('Вчера')
};


}
/*
     FILE ARCHIVED ON 21:57:14 Oct 29, 2015 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 20:40:45 Sep 22, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  esindex: 0.023
  CDXLines.iter: 34.876 (3)
  load_resource: 251.338 (2)
  exclusion.robots: 0.443
  exclusion.robots.policy: 0.42
  captures_list: 239.312
  PetaboxLoader3.resolve: 233.706 (3)
  RedisCDXSource: 11.738
  PetaboxLoader3.datanode: 173.306 (5)
  LoadShardBlock: 186.449 (3)
*/