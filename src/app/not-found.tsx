import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center mt-15 justify-center min-h-125 ">
      <div className="glass-container  text-center">
        <div className="flex justify-center mb-4">
          <picture>
            <img
              src="/page-not-found.svg"
              alt="Not Found"
              loading="lazy"
              width={250}
              height={250}
              className="opacity-80"
            />
          </picture>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          Página no encontrada
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Lo sentimos, la página que estás buscando no existe.
        </p>

        <Link
          href="/"
          className="text-blue-500 dark:text-blue-400 hover:underline text-lg"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
