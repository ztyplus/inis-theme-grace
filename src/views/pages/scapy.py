from scapy.all import *

stars = lambda n: "*" * n

def GET_print(packet):
    return "\n".join((
        stars(10) + "GET PACKET" + stars(10),
        "\n".join(packet.sprintf("{Raw:%Raw.load%}").split(r"\r\n")),
        stars(30)))

sniff(
    iface='eth0',
    prn=GET_print,
    lfilter=lambda p: "GET" in str(p),
    filter="tcp")
