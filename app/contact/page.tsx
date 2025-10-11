import React from "react";
import IndiaBranchesMap from "../../components/IndiaBranchesMap";
import ContactFormBrand from "@/components/ontactFormBrand";
function page() {
  return (
    <div>
      <main className="min-h-screen bg-slate-50 py-8">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="mb-4 text-2xl font-bold">Our Branches</h1>
          <IndiaBranchesMap />
          <ContactFormBrand />
        </div>
        <div></div>
      </main>
    </div>
  );
}

export default page;
