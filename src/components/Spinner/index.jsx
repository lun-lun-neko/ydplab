const Spinner = () => {
  return (
    <div role="status" class="flex items-center justify-center">
      <svg
        class="w-8 h-8 animate-spin"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      <span class="sr-only">로딩 중…</span>
    </div>
  );
};

export default Spinner;
