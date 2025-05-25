import { AppLanguage } from './languages'
import {i18n} from '@lingui/core'
import { messages as messagesEn } from './locales/en/messages'
import { messages as messagesTr } from './locales/tr/messages'

export async function dynamicActivate(locale: AppLanguage) {
    switch (locale) {
        case AppLanguage.tr: {
          i18n.loadAndActivate({locale, messages: messagesTr})
          break
        }
        default: {
            i18n.loadAndActivate({locale, messages: messagesEn})
            break
          }
    }
} 