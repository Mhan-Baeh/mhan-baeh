import { Link } from "react-router-dom";

export const HomeShow = () => {
  return (
    <div
      style={{
        backgroundImage: `url("https://media.discordapp.net/attachments/1150062586025476206/1174171540884037682/home.png?ex=65669f76&is=65542a76&hm=052330fdd37c8cb57100ac9cd69e11f49400de28a241de108522defbddfa243f&=&width=2160&height=800")`,
        width: "100%",
        height: "30rem",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center top",
        backgroundSize: "cover",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "30rem",
          padding: "5%",
        }}
        className="flex justify-start items-center"
      >
        <div className="flex flex-col justify-center items-start gap-4">
          <div
            className="flex text-xl"
            style={{ color: "#6C8FD5", minWidth: "20rem" }}
          >
            The Best Cleaning Service Ever!
          </div>
          <div
            className="flex text-4xl"
            style={{ color: "#142880", minWidth: "20rem" }}
          >
            We Clean You Relax
          </div>
          <div
            className="flex text-sm max-w-md"
            style={{ color: "#000", minWidth: "20rem" }}
          >
            Our best-in-class WordPress solution, with additional optimization
            to make running a Mhan Baeh. Our prices are clear and straight
            forward so you can.
          </div>
        </div>
      </div>
      <div className="p-5 bg-white">
        <div className="flex flex-col items-center md:flex-row md:justify-center gap-5 md:gap-40 mt-5">
          <Link
            to="/hirings"
            className="flex w-2/3 md:w-1/3 justify-center no-underline rounded-md shadow-md py-3 text-2xl"
            style={{ backgroundColor: "#D9EEFF", color: "#142880" }}
          >
            Hire a housekeeper
          </Link>
          <Link
            to="/appointments"
            className="flex w-2/3 md:w-1/3 justify-center no-underline rounded-md shadow-md py-3 text-2xl"
            style={{ backgroundColor: "#D9EEFF", color: "#142880" }}
          >
            See Your Appointments
          </Link>
        </div>
      </div>
      <div className="p-5 bg-white">
        <div className="flex flex-col justify-start items-center md:flex-row md:justify-center md:items-start gap-5 md:gap-20">
          <div
            className="flex flex-col w-10/12 md:w-5/12 justify-center no-underline rounded-md shadow-md p-5"
            style={{ backgroundColor: "#F2F8FD" }}
          >
            <div className="flex mb-2 text-2xl" style={{ color: "#5D6BA7" }}>
              Trusted Cleaners
            </div>
            <div className="flex text-md" style={{ color: "#A1B6E1" }}>
              - Experienced & Professional: Our team consists of seasoned
              professionals who have been trained to provide the highest
              standards of cleanliness.
            </div>
            <div className="flex text-md" style={{ color: "#A1B6E1" }}>
              - Background Checked: Every cleaner undergoes a thorough
              background check to ensure your safety and trust.
            </div>
          </div>
          <div
            className="flex flex-col w-10/12 md:w-5/12 justify-center no-underline rounded-md shadow-md p-5"
            style={{ backgroundColor: "#F2F8FD" }}
          >
            <div className="flex mb-2 text-2xl" style={{ color: "#5D6BA7" }}>
              Reliable services
            </div>
            <div className="flex text-md" style={{ color: "#A1B6E1" }}>
              - Consistency is Key: With Reliable Services, expect the same
              high-quality cleaning every time.
            </div>
            <div className="flex text-md" style={{ color: "#A1B6E1" }}>
              - Timely Service: We respect your time. Our cleaners always arrive
              punctually and complete the job within the stipulated time frame.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
