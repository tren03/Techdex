## The Pain of Windows: iPad Screen Mirroring Woes
Its been a while since I shifted to windows, as the dual boot situation was absolutely butchering my poor laptop. During my time in Linux, I got to learn a lot about how software works in general, and the about the amazing ecosystem of OSS Software that exists.

One of the tools that absolutely blew my mind away was Uxplay. For those who are unfamiliar with it, it is an AirPlay client for Linux, that allows us to mirror iOS and iPadOS screens onto our system. I had always thought that AirPlay was proprietary to apple, so I was surprised to see how easy the installation and usage of Uxplay was.

The motivation to mirror my iPad screen on my system was purely procastination. I had to study data structures and just thought "Mirroring my iPad screen to view my handwritten notes on a bigger screen is the only thing stopping my progression".

Now, after shifting back to windows, I wanted to use the Uxplay for mirroring. When I checked their docs, They had this complicated build step, which involved other third party software. I was pretty confident that a feature as simple as ipad mirroring would be solved, and would be packaged as a simple windows executable which I could run.

So, I asked chatgpt to give me a list of applications for it and it gave me a handful
Some of them were
* Lonely Screen [https://www.lonelyscreen.com/](https://www.lonelyscreen.com/)
* IMyFone [https://www.imyfone.com/screen-mirror/](https://www.imyfone.com/screen-mirror/)
* A bunch of sketchy Windows Store apps (Should have known none of them would work)
* Ux-play-windows client [https://github.com/leapbtw/uxplay-windows](https://github.com/leapbtw/uxplay-windows)
 
The above was the order in which I tried them.
Almost all had a paid tier, apart from Uxplay, AND NONE OF THEM WORKED.
I had tried all of the troubleshooting steps listed by each application, including changing firewall settings and wifi configurations, but my devices were not able to detect my PC as AirPlay client.

After trying everything for nearly 2 days, I came back to Uxplay. I installed their windows fork, but it still did not show my PC as a client.

As I had exhausted all options, as a final hail mary, I opened the Uxplay docs, and started reading through the Windows build steps.
I did seem complicated at first, so with the help of some ai and the web, I tried to exactly understand what each of these steps were.

* Bonjour SDK v3.0 : AirPlay service discovery
* MSYS2 : Unix shell environment for building native windows apps
* Uxplay repository
* MinGW-64 compiler and cmake : Building the software
* Other dependencies for Uxplay like Gstreamer and its plugins 

And sure enough, it worked!! (After googling my way through some path and terminal issues ofcourse)

![img](/ipad-mirroring.png "Ipad Mirroring works!")

Here's the link to Uxplay : [https://github.com/antimof/UxPlay](https://github.com/antimof/UxPlay)


It was surpsing that most of the windows alternatives were paid which did not work, while there was a free alternative that worked with just a bit of tinkering.
If you're in the same boat, skip the paid tools and build Uxplay yourself. It’s worth it.



