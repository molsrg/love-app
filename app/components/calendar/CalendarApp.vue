<script lang="ts" setup>
import type { DateValue } from '@internationalized/date'
import { monthTranslate } from '~/helpers/calendar.helper'

type CalendarSize = 'sm' | 'md' | 'lg' | 'xl'
type WeekdayFormat = 'short' | 'long' | 'narrow'

/**
 * Props for the CalendarApp component
 * @property {DateValue[]} modelValue - Selected dates
 * @property {string[]} scheduleDays - Days that are scheduled
 * @property {string} iconName - Icon to display on days
 * @property {CalendarSize} size - Size of the calendar
 * @property {boolean} multiply - Allow multiple date selection
 * @property {boolean} fixedWeeks - Show fixed number of weeks
 * @property {WeekdayFormat} weekdayFormat - Format of weekday names
 * @property {boolean} showYearControls - Show year navigation controls
 */
interface Props {
  modelValue?: DateValue | null
  scheduleDays?: string[]
  iconName?: string
  size?: CalendarSize
  multiply?: boolean
  fixedWeeks?: boolean
  weekdayFormat?: WeekdayFormat
  showYearControls?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  scheduleDays: () => [],
  iconName: () => '',
  size: 'md',
  multiply: false,
  fixedWeeks: false,
  weekdayFormat: 'short',
  showYearControls: false,
})

/**
 * Emits for the CalendarApp component
 * @event update:modelValue - Emitted when selected dates change
 * @event update:dayClick - Emitted when a day is clicked
 */
const emit = defineEmits<{
  'update:modelValue': [value: DateValue | null]
  'update:dayClick': [day: DateValue]
}>()

const { t } = useI18n()

// Computed property for two-way binding
const selectedDays = computed({
  get: () => props.modelValue ? [props.modelValue] : [],
  set: (value: DateValue[]) => emit('update:modelValue', value[0] || null),
})

/**
 * Handles day click events
 * @param day - The clicked day
 */
function handleDayClick(day: DateValue) {
  emit('update:dayClick', day)
}
</script>

<template>
  <UCalendar
    v-model="selectedDays"
    :fixed-weeks="fixedWeeks"

    :multiple="multiply"
    :size="size"
    :year-controls="showYearControls"
    :weekday-format="weekdayFormat"
  >
    <template #heading="{ value }">
      {{ monthTranslate(value) }}
    </template>
    <template #week-day="{ day }">
      {{ t(`calendar.day.${day}`) }}
    </template>
    <template #day="{ day }">
      <div
        class="flex flex-col items-center cursor-pointer"

        @click.stop="handleDayClick(day)"
      >
        <p>{{ day.day }}</p>
        <UIcon
          v-if="iconName"
          :name="iconName"
          class="size-5"
        />
      </div>
    </template>
  </UCalendar>
</template>
