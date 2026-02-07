"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  MapPin,
  Music,
  MessageCircle,
  Heart,
  Trash2,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function HelpButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-600 hover:text-rose-600 hover:bg-rose-50"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Heart className="h-6 w-6 text-rose-500" fill="currentColor" />
            HeartMap Guide
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            {/* Quick Start */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Quick Start
              </h3>
              <p className="text-gray-600 mb-4">
                Welcome to HeartMap! Share your love with the world in three
                easy steps:
              </p>
              <ol className="space-y-3 text-gray-600">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 text-rose-600 text-sm font-semibold">
                    1
                  </span>
                  <span>Drop your pin on the map with your love status</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 text-rose-600 text-sm font-semibold">
                    2
                  </span>
                  <span>Add a YouTube song that represents your feelings</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 text-rose-600 text-sm font-semibold">
                    3
                  </span>
                  <span>
                    Connect and chat with other hearts around the world
                  </span>
                </li>
              </ol>
            </section>

            {/* Features */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Features</h3>

              <div className="space-y-4">
                {/* Add Pin */}
                <div className="flex gap-4 p-4 bg-rose-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-rose-600" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Drop a Pin
                    </h4>
                    <p className="text-sm text-gray-600">
                      Click the <strong>+ button</strong> in the bottom right
                      corner to add your pin. Share your location, status
                      (Single, Taken, or It&apos;s Complicated), and a message.
                      <br />
                      <br />
                      <strong>Note:</strong> You can only have one pin at a
                      time. Dropping a new pin will replace your old one.
                    </p>
                  </div>
                </div>

                {/* Music */}
                <div className="flex gap-4 p-4 bg-pink-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <Music className="h-6 w-6 text-pink-600" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Add Your Love Song
                    </h4>
                    <p className="text-sm text-gray-600">
                      Paste a YouTube video URL or ID to attach a song to your
                      pin. When others click your pin, they&apos;ll see your
                      message and can play your special tune!
                      <br />
                      <br />
                      <strong>Tip:</strong> Choose a song that captures your
                      current vibe or feelings.
                    </p>
                  </div>
                </div>

                {/* Chat */}
                <div className="flex gap-4 p-4 bg-red-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <MessageCircle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Chat with Others
                    </h4>
                    <p className="text-sm text-gray-600">
                      Click any pin on the map to view their profile and status.
                      Click <strong>&quot;Start Chat&quot;</strong> to send them
                      a message and begin a conversation.
                      <br />
                      <br />
                      Your active chats appear as floating heads on the right
                      side of the screen.
                    </p>
                  </div>
                </div>

                {/* Delete Pin */}
                <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <Trash2 className="h-6 w-6 text-gray-600" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Remove Your Pin
                    </h4>
                    <p className="text-sm text-gray-600">
                      Click on your own pin and select{" "}
                      <strong>&quot;Remove Pin&quot;</strong> to delete it from
                      the map. You can always add a new one later!
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Tips */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                💡 Tips for the Best Experience
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="text-rose-500">•</span>
                  <span>
                    Be authentic and respectful when chatting with others
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-500">•</span>
                  <span>Choose songs that truly represent your feelings</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-500">•</span>
                  <span>
                    Explore the map to discover love stories from around the
                    world
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-500">•</span>
                  <span>Update your pin status as your situation changes</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-500">•</span>
                  <span>
                    Spread love and positivity in all your interactions
                  </span>
                </li>
              </ul>
            </section>

            {/* FAQ */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Frequently Asked Questions
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-900">
                    Can I have multiple pins?
                  </p>
                  <p className="text-gray-600">
                    No, you can only have one active pin at a time. Creating a
                    new pin will replace your existing one.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    How do I edit my pin?
                  </p>
                  <p className="text-gray-600">
                    Click on your pin and select &quot;Remove Pin&quot;, then
                    create a new one with updated information.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Are chats private?
                  </p>
                  <p className="text-gray-600">
                    Yes, your chats are one-on-one and only visible to you and
                    the other person.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Can others see my exact location?
                  </p>
                  <p className="text-gray-600">
                    Only the location of your pin is visible, which you choose
                    when creating it. Your actual real-time location is never
                    shared.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>

        <div className="flex justify-end pt-4 border-t">
          <Button
            onClick={() => setIsOpen(false)}
            className="bg-rose-500 hover:bg-rose-600"
          >
            Got it! ❤️
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
