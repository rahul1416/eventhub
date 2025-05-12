"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ChevronLeft, CreditCard, Check } from "lucide-react"
import { useRouter } from 'next/navigation';
// import { v4 as uuidv4 } from "uuid";

export default function RegisterPage({ params }: { params: { id: string } }) {
  const [step, setStep] = useState(1)
  const [ticketType, setTicketType] = useState("standard")
  const [ticketQuantity, setTicketQuantity] = useState(1)

  const handleNext = () => {
    setStep(step + 1)
    window.scrollTo(0, 0)
  }

  const handleBack = () => {
    setStep(step - 1)
    window.scrollTo(0, 0)
  }
  const [attendee, setAttendee] = useState({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      referral: "social", // default value
    });
  const router = useRouter()
  
  const handleComplete = async () => {
    if (!attendee.email || !attendee.firstName || !attendee.lastName) {
      alert("Please fill in all required fields.");
      return;
    }
  
    // Dummy/fallback values in place of Firebase and UUID
    const userId = "dummy-user-id";   // Replace with actual user logic later
    const ticketId = "dummy-ticket-id"; // Replace with actual ticket logic later
  
    const registrationData = {
      eventId: params?.id,
      userId,
      ticketId,
      customFields: {
        firstName: attendee.firstName,
        lastName: attendee.lastName,
        email: attendee.email,
        phone: attendee.phone || "",
        company: attendee.company || "",
        referral: attendee.referral || "",
      },
      isCheckedIn: false,
      checkedInAt: null,
    };
  
    try {
      // const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registrations`;
  
      // if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
      //   throw new Error("API base URL is not defined in env");
      // }
  
      // const response = await fetch(apiUrl, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   credentials: "include", // optional depending on auth setup
      //   body: JSON.stringify(registrationData),
      // });
  
      // const result = await response.json();
  
      // if (!response.ok || result.status !== true) {
      //   const errorMessage = result?.message || "Registration failed.";
      //   throw new Error(errorMessage);
      // }
  
      // console.log("Registration Success:", result);
  
      router.push(
        `/qrcode?email=${attendee.email}&firstName=${attendee.firstName}&lastName=${attendee.lastName}`
      );
    } catch (error) {
      console.error("Error during registration:", error);
      alert(
        "There was an issue completing your registration. Please try again."
      );
    }
  };
  

  // Calculate total price
  const getPrice = () => {
    const basePrice = ticketType === "standard" ? 299 : 599
    return basePrice * ticketQuantity
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="container max-w-4xl">
          <div className="mb-8">
            <Link
              href={`/events/${params.id}`}
              className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to Event
            </Link>
            <h1 className="text-3xl font-bold">Register for Event</h1>
            <p className="text-muted-foreground">Complete the registration process to secure your spot.</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    step >= i ? "gradient-bg text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > i ? <Check className="h-5 w-5" /> : i}
                </div>
                {i < 3 && <div className={`h-1 w-16 md:w-32 ${step > i ? "gradient-bg" : "bg-muted"}`}></div>}
              </div>
            ))}
          </div>

          {/* Step 1: Ticket Selection */}
          {step === 1 && (
            <div className="glass-effect rounded-xl p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6">Select Tickets</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Ticket Type</h3>
                  <RadioGroup value={ticketType} onValueChange={setTicketType}>
                    <div className="grid gap-4">
                      <div
                        className={`relative rounded-lg border p-4 transition-all ${
                          ticketType === "standard" ? "border-primary ring-2 ring-primary/20" : ""
                        }`}
                      >
                        <RadioGroupItem value="standard" id="standard" className="absolute right-4 top-4" />
                        <div className="flex justify-between">
                          <Label htmlFor="standard" className="text-lg font-medium">
                            Standard Ticket
                          </Label>
                          <div className="text-xl font-bold">$299</div>
                        </div>
                        <p className="text-muted-foreground mt-1 mb-3">General admission with access to all sessions</p>
                        <ul className="space-y-1 text-sm">
                          <li className="flex items-center gap-2">
                            <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Access to all sessions
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Lunch and refreshments
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Conference materials
                          </li>
                        </ul>
                      </div>

                      <div
                        className={`relative rounded-lg border p-4 transition-all ${
                          ticketType === "vip" ? "border-primary ring-2 ring-primary/20" : ""
                        }`}
                      >
                        <RadioGroupItem value="vip" id="vip" className="absolute right-4 top-4" />
                        <div className="flex justify-between">
                          <Label htmlFor="vip" className="text-lg font-medium">
                            VIP Ticket
                          </Label>
                          <div className="text-xl font-bold">$599</div>
                        </div>
                        <p className="text-muted-foreground mt-1 mb-3">Premium experience with exclusive perks</p>
                        <ul className="space-y-1 text-sm">
                          <li className="flex items-center gap-2">
                            <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            All Standard ticket benefits
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            VIP lounge access
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Exclusive networking event
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Speaker meet & greet
                          </li>
                        </ul>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Quantity</h3>
                  <div className="flex items-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                      disabled={ticketQuantity <= 1}
                    >
                      -
                    </Button>
                    <div className="w-16 text-center font-medium">{ticketQuantity}</div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setTicketQuantity(Math.min(10, ticketQuantity + 1))}
                      disabled={ticketQuantity >= 10}
                    >
                      +
                    </Button>
                    <div className="ml-4 text-sm text-muted-foreground">(Maximum 10 tickets per order)</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Discount Code</h3>
                  <div className="flex gap-2">
                    <Input placeholder="Enter code" />
                    <Button variant="outline">Apply</Button>
                  </div>
                </div>

                <div className="border-t pt-6 mt-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-lg font-medium">Total</div>
                    <div className="text-2xl font-bold">${getPrice().toFixed(2)}</div>
                  </div>

                  <Button className="w-full gradient-bg button-glow py-6 text-lg" onClick={handleNext}>
                    Continue to Information
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Attendee Information */}
          {step === 2 && (
            <div className="glass-effect rounded-xl p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6">Attendee Information</h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    {/* <Input id="firstName" placeholder="John" /> */}
                    <Input
                        id="firstName"
                        placeholder="John"
                        value={attendee.firstName}
                        onChange={(e) =>
                          setAttendee({ ...attendee, firstName: e.target.value })
                        }
                      />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    {/* <Input id="lastName" placeholder="Doe" /> */}
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={attendee.lastName}
                      onChange={(e) =>
                        setAttendee({ ...attendee, lastName: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  {/* <Input id="email" type="email" placeholder="john.doe@example.com" /> */}
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={attendee.email}
                    onChange={(e) => setAttendee({ ...attendee, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="(123) 456-7890" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company/Organization</Label>
                  <Input id="company" placeholder="Acme Inc." />
                </div>

                <div className="space-y-2">
                  <Label>How did you hear about this event?</Label>
                  <RadioGroup defaultValue="social">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="social" id="social" />
                      <Label htmlFor="social">Social Media</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="email" />
                      <Label htmlFor="email">Email Newsletter</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="friend" id="friend" />
                      <Label htmlFor="friend">Friend/Colleague</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="border-t pt-6 mt-6 flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button className="gradient-bg button-glow" onClick={handleNext}>
                    Continue to Payment
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment & Confirmation */}
          {step === 3 && (
            <div className="glass-effect rounded-xl p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6">Payment & Confirmation</h2>

              <div className="space-y-6">
                <div className="rounded-lg border p-4 bg-muted/10">
                  <h3 className="font-medium mb-4">Order Summary</h3>
                  <div className="flex justify-between mb-2">
                    <span>{ticketType === "standard" ? "Standard Ticket" : "VIP Ticket"}</span>
                    <span>x{ticketQuantity}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">Tech Conference 2025</div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${getPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing Fee</span>
                      <span>$9.99</span>
                    </div>
                    <div className="border-t my-2 pt-2 flex justify-between font-medium">
                      <span>Total</span>
                      <span>${(getPrice() + 9.99).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <span className="font-medium">Credit Card</span>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input id="cardName" placeholder="John Doe" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" placeholder="123" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4 flex items-center">
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Your Ticket Will Be Emailed</h4>
                    <p className="text-sm text-muted-foreground">
                      After payment, you'll receive a confirmation email with your ticket and QR code.
                    </p>
                  </div>
                </div>

                <div className="border-t pt-6 mt-6 flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button className="gradient-bg button-glow" onClick={handleComplete}>
                    Complete Registration
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
