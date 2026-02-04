'use client';

interface ToggleButtonProps {
  isRegister: boolean;
  setIsRegister: (value: boolean) => void;
}

export default function ToggleButton({
  isRegister,
  setIsRegister,
}: ToggleButtonProps) {
  return (
    <div className="text-center mt-4">
      <button
        onClick={() => setIsRegister(!isRegister)}
        className="text-indigo-600 hover:underline cursor-pointer"
      >
        {isRegister
          ? 'Already have an account? Login'
          : "Don't have an account? Register"}
      </button>
    </div>
  );
}



