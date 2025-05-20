import { RegisterOrganizerForm } from "./components/RegisterOrganizerForm";

const RegisterOrganizerPage = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterOrganizerForm />
      </div>
    </div>
  );
};

export default RegisterOrganizerPage;
