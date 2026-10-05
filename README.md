# nutrifri

Blog de nutrición hecho con Next.js 16, Firebase (Firestore + Auth con Google) y Cloudinary para las imágenes.

- **Sitio público:** inicio, `/blog` con filtro por categoría y `/blog/[slug]` con un panel lateral de preguntas y comentarios en tiempo real.
- **Panel de administración** (`/admin`): crear, editar, publicar y borrar artículos con un editor completo (tipografías, tamaños, colores, resaltado, alineación, listas, citas, enlaces e imágenes).

## Configuración inicial (una sola vez)

### 1. Firebase

1. **Crear la base de datos:** en [console.firebase.google.com](https://console.firebase.google.com) → tu proyecto → **Firestore Database** → *Crear base de datos*. Elige modo producción y una región cercana (por ejemplo `us-central1` o `northamerica-south1`).
2. **Activar el login con Google:** **Authentication** → *Sign-in method* → **Google** → Habilitar.
3. **Dominios autorizados:** **Authentication** → *Settings* → *Authorized domains*. Agrega tu dominio de Vercel (por ejemplo `nutrifri.vercel.app`). `localhost` ya viene incluido.
4. **Publicar las reglas de seguridad:** copia el contenido de [`firestore.rules`](firestore.rules) en **Firestore → Reglas** y pulsa *Publicar*. Si tienes la CLI de Firebase, también puedes usar `npx firebase-tools deploy --only firestore:rules`.
5. **Dar de alta a las administradoras:** en **Firestore → Datos**:
   - Crea la colección `admins`.
   - Agrega un documento por admin. El **ID del documento es su correo de Gmail en minúsculas** (por ejemplo `nutri@gmail.com`).
   - El documento puede tener un solo campo cualquiera, por ejemplo `nombre: "Fri"`.

### 2. Cloudinary (imágenes)

1. Crea una cuenta gratis en [cloudinary.com](https://cloudinary.com).
2. En **Settings → API Keys** copia el *Cloud name*, el *API Key* y el *API Secret*.

### 3. Variables de entorno

Copia `.env.example` a `.env.local` y llena los valores. En **Vercel → Project Settings → Environment Variables** agrega las mismas:

| Variable | ¿Secreta? |
|---|---|
| `NEXT_PUBLIC_FIREBASE_*` | No (es la configuración del cliente de Firebase) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | No |
| `CLOUDINARY_API_KEY` | **Sí** |
| `CLOUDINARY_API_SECRET` | **Sí** |

## Desarrollo

```bash
npm install
npm run dev
```

Abre http://localhost:3000. El panel está en http://localhost:3000/admin.

## Cómo funciona

- **Lectura de artículos:** el servidor lee Firestore por REST y guarda el resultado en la caché de Next con la etiqueta `posts`. Al guardar en el panel, la acción `refreshPosts` invalida esa caché y el cambio se ve al instante.
- **Seguridad:** las reglas de Firestore solo dejan escribir posts a las cuentas que están en `admins`. Los comentarios los puede crear cualquier persona que haya entrado con Google, y solo se pueden borrar los propios (las admins pueden borrar cualquiera).
- **Imágenes:** el navegador sube directo a Cloudinary con una firma que genera el servidor tras verificar que quien sube es admin. El API Secret nunca llega al navegador.
- **Editar textos fijos:** el nombre, el Instagram y las categorías se cambian en [`lib/site.ts`](lib/site.ts). Las fotos de la página principal están en `public/images/` (son de Unsplash, con licencia libre).

## Flujo de trabajo

`main` está protegida: todo cambio entra por Pull Request. El CI corre lint y la revisión de tipos, y Vercel genera un preview. Cuando haces merge, se despliega a producción.
