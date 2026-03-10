# Wishlist API

Все ручки требуют заголовок `Authorization: Bearer <token>`.

---

## Модели данных

### WishlistItemResponse — свой вишлист

```ts
{
  id: string;
  title: string;
  description?: string;
  link?: string;
  imageUrl?: string;
  price?: number;
  isBooked: boolean;   // true = партнёр уже забронировал, не удаляй
  createdAt: string;   // ISO 8601
}
```

### PartnerWishlistItemResponse — вишлист партнёра

```ts
{
  id: string;
  title: string;
  description?: string;
  link?: string;
  imageUrl?: string;
  price?: number;
  isBooked: boolean;  // true = ты уже забронировал этот подарок
  createdAt: string;  // ISO 8601
}
```

### CreateWishlistItemRequest — тело запроса на создание

```ts
{
  title: string;        // обязательное
  description?: string;
  link?: string;
  imageUrl?: string;
  price?: number;
}
```

---

## Ручки

### Свой вишлист

#### `GET /wishlist`

Получить свой список желаний.

**Response `200`:** `WishlistItemResponse[]`

> `isBooked: true` означает, что партнёр уже забронировал этот подарок.
> Не показывай кто именно — это сюрприз.

---

#### `POST /wishlist`

Добавить желание в свой вишлист.

**Body:** `CreateWishlistItemRequest`

**Response `201`:** `WishlistItemResponse`

---

#### `DELETE /wishlist/:id`

Удалить желание из своего вишлиста.

> Перед удалением рекомендуется проверить `isBooked` — если `true`, предупреди пользователя, что подарок уже забронирован партнёром.

**Response `200`:** `true`

**Ошибки:**
| Код | error | Описание |
|-----|-------|----------|
| 404 | `WISHLIST_ITEM_NOT_FOUND` | Элемент не найден |
| 403 | `NOT_YOUR_WISHLIST_ITEM` | Чужой элемент |

---

### Вишлист партнёра

#### `GET /wishlist/partner`

Получить список желаний партнёра.

**Response `200`:** `PartnerWishlistItemResponse[]`

> `isBooked: true` — ты уже забронировал этот подарок, можно отменить бронь.

---

### Бронирование

#### `POST /wishlist/:id/book`

Забронировать подарок из вишлиста партнёра.

**Response `201`:** `true`

**Ошибки:**
| Код | error | Описание |
|-----|-------|----------|
| 404 | `WISHLIST_ITEM_NOT_FOUND` | Элемент не найден или не принадлежит партнёру |
| 409 | `ALREADY_BOOKED` | Уже забронирован |

---

#### `DELETE /wishlist/:id/book`

Снять бронь с подарка партнёра.

**Response `200`:** `true`

**Ошибки:**
| Код | error | Описание |
|-----|-------|----------|
| 404 | `WISHLIST_ITEM_NOT_FOUND` | Элемент не найден или не принадлежит партнёру |
| 409 | `NOT_BOOKED` | Не забронирован |
| 403 | `BOOKING_NOT_YOURS` | Бронь сделана кем-то другим |

---

## Общие ошибки (все ручки)

| Код | error            | Описание                       |
| --- | ---------------- | ------------------------------ |
| 404 | `PAIR_NOT_FOUND` | Пользователь не состоит в паре |
| 401 | —                | Невалидный или истёкший JWT    |
